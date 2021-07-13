import React, { useEffect, useState, useRef, useCallback } from 'react';
import checkExpiration from '../lib/checkExpiration';
import styles from '../styles/layout/Layout.module.scss';
import contentStyles from '../styles/layout/Content.module.scss';
import buttonStyles from '../styles/components/Button.module.scss';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { SpotifyApi } from '../lib/SpotifyApi';

export default function artist() {
  const [artists, setArtists] = useState([]);
  const [flag, setFlag] = useState(false);
  const spotifyAPI = useRef(null);

  useEffect(() => {
    spotifyAPI.current = new SpotifyApi();

    const getArtist = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw 'アクセストークンを取得できていません';
      }
      checkExpiration();

      // Spotify ユーザーのTOP Artist取得
      const response = await spotifyAPI.current.getTopArtistsByUser();
      if (response.error) {
        alert(
          `サインインしてください。\n${response.error.status} ${response.error.message}`
        );
        location.href = '/';
        return;
      }
      setArtists(response);
    }
    getArtist();
  }, []);

  const getArtistByTerm = async (term) => {
    const response = await spotifyAPI.current.getDataByTerm(term, 'artists');
    if (response.error) return;
    setArtists(response.items);
  };

  const createPlaylistHandler = async () => {
    try {
      const playlistsConfig = {
        name: 'Playlists of your favorite artists',
        description: 'Playlists of your favorite artists',
        public: true,
      };
      await spotifyAPI.current.getPlaylistId(playlistsConfig);

      const tracks_uri = await spotifyAPI.current.getArtistTrackUris(artists);
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

  const closeModal = useCallback(() => setFlag(false), []);

  const displayArtists = artists.map((artist, i) => {
    return (
      <li key={artist.id} className={contentStyles.list}>
        <span className={contentStyles.order_number}>{i + 1}</span>
        <img
          className={contentStyles.img}
          src={artist.images[1].url}
          alt={artist.name}
        />
        <span className={contentStyles.music_info}>
          <p className={contentStyles.content_name}>{artist.name}</p>
          <p className={contentStyles.genre_info}>{artist.genres}</p>
        </span>
      </li>
    );
  });

  return (
    <div className={styles.container}>
      <Header currentPage={'artist'} title={'Top Artists'} />
      <main className={styles.main}>
        <section className={contentStyles.sec_contents}>
          <div className={contentStyles.time_range_selector}>
            <button
              className={`${buttonStyles.button} ${buttonStyles.blue}`}
              onClick={() => getArtistByTerm('short_term')}>
              Last month
            </button>
            <button
              className={`${buttonStyles.button} ${buttonStyles.blue}`}
              onClick={() => getArtistByTerm('medium_term')}>
              Last 6 month
            </button>
            <button
              className={`${buttonStyles.button} ${buttonStyles.blue}`}
              onClick={() => getArtistByTerm('long_term')}>
              All time
            </button>
          </div>
          <ul>{displayArtists}</ul>
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
