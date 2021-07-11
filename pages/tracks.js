import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import checkExpiration from '../lib/checkExpiration';
import styles from '../styles/layout/Layout.module.scss';
import contentStyles from '../styles/layout/Content.module.scss';
import buttonStyles from '../styles/components/Button.module.scss';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { SpotifyApi } from '../lib/SpotifyApi';

export default function tracks() {
  const [tracks, setTracks] = useState([]);
  const [flag, setFlag] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingTrack, setPlayingTrack] = useState('');
  const playerRef = useRef(null);
  const spotifyAPI = useRef(null);

  const spotifyWebPlayer = () => {
    const accessToken = localStorage.getItem('accessToken');
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'Spellista Player',
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.2
      });

      player.addListener('ready', ({ device_id }) => {
        // 楽曲再生に必要なdevice_idを取得しstateに格納する
        setDeviceId(device_id);
      });

      player.connect();
      playerRef.current = player;
    };
  };

  const installWebPlayer = () => {
    // Spotify Web Player SDK Install
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://sdk.scdn.co/spotify-player.js';
    document.querySelector('body').appendChild(scriptTag);
    spotifyWebPlayer();
  };

  useEffect(() => {
    spotifyAPI.current = new SpotifyApi();

    const getTracks = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw 'アクセストークンを取得できていません';
        }
        checkExpiration();
        // Spotify ユーザーのTOP Tracks取得
        const topTracks = await spotifyAPI.current.getTopTracksByUser();
        setTracks(topTracks);
        installWebPlayer();
      } catch (error) {
        if (error === 'アクセストークンを取得できていません') {
          alert(`サインインしてください。`);
          location.href = '/';
        }
      }
    };
    getTracks();
  }, []);

  const getTrackByTerm = async (term) => {
    const response = await spotifyAPI.current.getDataByTerm(term, 'tracks');
    if (response.error) return;
    setTracks(response.items);
  };

  const displayTracks = tracks.map((track, i) => {
    return (
      <li key={track.id} className={contentStyles.list}>
        <span className={contentStyles.order_number}>{i + 1}</span>
        <img
          className={contentStyles.img}
          src={track.album.images[1].url}
          alt={track.name}
        />
        <span className={contentStyles.music_info}>
          <p className={contentStyles.content_name}>{track.name}</p>
          <p className={contentStyles.genre_info}>{track.artists[0].name}</p>
        </span>
        <button className={buttonStyles.play_icon} onClick={() => playbackTrack(track)}>
          <Image
            src={playingTrack === track ? '/stop.png' : '/play.png'}
            alt="再生する"
            width={30}
            height={30}
          />
        </button>
      </li>
    );
  });

  const createPlaylistHandler = async () => {
    try {
      const playlistsConfig = {
        name: 'Playlists of your favorite tracks',
        description: 'Playlists of your favorite tracks',
        public: true,
      };
      await spotifyAPI.current.getPlaylistId(playlistsConfig);

      const tracks_uri = await spotifyAPI.current.getTopTrackUris(tracks);
      const responseStatus = await spotifyAPI.current.createPlaylist(tracks_uri);
      if (responseStatus === 201) setFlag(true);
    } catch (error) {
      const errorObject = JSON.stringify(error.data.error);
      const statusCode = error.data.error.status;
      let m = alertsByErrorCode(statusCode);
      alert(`${errorObject}\n\n${m}`);
      location.href = '/';
    }
  };

  const playbackTrack = async (track) => {
    /**
     * useState
     * tracks, deviceId, playingTrack
     */
    try {
      if (playingTrack && playingTrack.id === track.id) {
        // 再生中の曲と再生ボタンを押した曲が同じならtogglePlayに。
        playerRef.current.togglePlay();

        playerRef.current.getCurrentState().then((state) => {
          if (!state.paused) {
            setPlayingTrack(null);
          }
        });

      } else {
        // 再生中の曲を格納
        setPlayingTrack(track);
        // status codeを取得、再生している状態を格納
        const statusCode = await spotifyAPI.current.playTrack(deviceId, track);
        if (statusCode === 204) setIsPlaying(true);
      }
    } catch(error) {
      const errorObject = JSON.stringify(error.data.error);
      const statusCode = error.status;
      let m = alertsByErrorCode(statusCode);
      alert(`${errorObject}\n\n${m}`);
      location.href = '/';
    }
  }

  function alertsByErrorCode(status) {
    const messagesByErrorCode = {
      400: 'アプリケーションのエラーが起きています。管理者へお問い合わせください。',
      401: 'アクセス権限がありません。ログインしてください。',
      403: 'アプリケーションのエラーが起きています。管理者へお問い合わせください。',
      404: 'アプリケーションのエラーが起きています。管理者へお問い合わせください。',
      429: 'リクエストが多いため利用制限されています。時間をおいて再度お試しください。',
      500: 'Spotifyのサーバーで障害が起きています。復旧までお待ちください。',
      502: 'Spotifyのサーバーで障害が起きています。復旧までお待ちください。',
      503: 'Spotifyのサーバーで一時的な障害が起きています。時間をおいて再度お試しください。',
    };
    return messagesByErrorCode[status];
  }

  const closeModal = () => {
    setFlag(false);
  };

  return (
    <div className={styles.container}>
      <Header currentPage={'tracks'} title={'Top Tracks'} />
      <main className={styles.main}>
        <section className={contentStyles.sec_contents}>
          <div className={contentStyles.time_range_selector}>
            <button
              className={`${buttonStyles.button} ${buttonStyles.blue}`}
              onClick={() => getTrackByTerm('short_term')}>
              Last month
            </button>
            <button
              className={`${buttonStyles.button} ${buttonStyles.blue}`}
              onClick={() => getTrackByTerm('medium_term')}>
              Last 6 month
            </button>
            <button
              className={`${buttonStyles.button} ${buttonStyles.blue}`}
              onClick={() => getTrackByTerm('long_term')}>
              All time
            </button>
          </div>
          
          <ul>{displayTracks}</ul>
          <div className={contentStyles.create_playlists}>
            <div className={contentStyles.create_playlists_inner}>
              <button
                className={`${buttonStyles.button} ${buttonStyles.dark}`}
                onClick={createPlaylistHandler}>
                Create Playlist
              </button>
            </div>
          </div>
        </section>
      </main>
      <Modal flag={flag} closeModal={closeModal} />
    </div>
  );
}
