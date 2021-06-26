import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import checkExpiration from '../lib/checkExpiration';
import config from '../config';
import styles from '../styles/layout/Layout.module.scss';
import contentStyles from '../styles/layout/Content.module.scss';
import artistStyles from '../styles/layout/Artist.module.scss';
import buttonStyles from '../styles/components/Button.module.scss';
import modalStyles from '../styles/components/Modal.module.scss';
import Header from '../components/Header';

const Modal = (props) => {
  if (!props.flag) return <></>;

  const handleCloseModal = () => {
    props.closeModal();
  }

  return (
    <div className={`${modalStyles.modal} ${modalStyles.is_show}`}>
      <div className={modalStyles.body}>
        <p className={modalStyles.text}>プレイリストを作成しました！</p>
        <div className={modalStyles.button_area}>
          <button type="button" onClick={handleCloseModal} className={modalStyles.close}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default function artist() {
  const [artists, setArtists] = useState([]);
  const [flag, setFlag] = useState(false);
  useEffect(() => {
    const getArtist = () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw 'アクセストークンを取得できていません';
        }
        checkExpiration();

        // Spotify ユーザーのTOP Artist取得
        const endpoint = `${config.API_URL}/me/top/artists`;
        const headers = { Authorization: `Bearer ${accessToken}` };
        axios.get(endpoint, { headers })
          .then((res) => {
            setArtists(res.data.items);
          })
          .catch((error) => {
            throw error.response.status;
          });
          
      } catch(error) {
        if (error === 'アクセストークンを取得できていません') {
          alert(`サインインしていません。\nサインインしてください。`);
          location.href = '/';
        }
      }
    }
    getArtist();
  }, []);

  const getArtistByTerm = (term) => {
    const accessToken = localStorage.getItem('accessToken');
    const endpoint = `${config.API_URL}/me/top/artists?time_range=${term}`;
    const headers = { Authorization: `Bearer ${accessToken}` };
    try {
      axios.get(endpoint, { headers })
        .then((res) => {
          setArtists(res.data.items);
        })
        .catch((error) => {
          throw error.response;
        });
    } catch(error) {
      const errorObject = JSON.stringify(error.data.error);
      const statusCode = error.data.error.status;

      let m = alertsByErrorCode(statusCode);
      alert(`${errorObject}\n\n${m}`);
      location.href = '/';
    }
  };

  const displayArtists = artists.map((artist, i) => {
    return (
      <li key={artist.id} className={contentStyles.list}>
        <span className={contentStyles.order_number}>{i + 1}</span>
        <img
          className={contentStyles.img}
          src={artist.images[1].url}
          alt={artist.name}
        />
        <span className={contentStyles.artist_info}>
          <p className={contentStyles.content_name}>{artist.name}</p>
          <p className={contentStyles.genre_info}>{artist.genres}</p>
        </span>
      </li>
    );
  });

  const createPlaylist = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${accessToken}` };

    // TODO axiosで通信する部分をモジュール化する, libにまとめる。
    try {
      // user_idを取得
      const endpoint = `${config.API_URL}/me`;
      const user_id = await axios.get(endpoint, { headers })
        .then((res) => {
          return res.data.id;
        })
        .catch((error) => {
          throw error.response;
        });

      // プレイリスト名、説明
      const playlistsConfig = {
        name: 'Playlists of your favorite artists',
        description: 'Playlists of your favorite artists',
        public: true,
      };

      // 空のplaylistを作成,idを取得
      const playlistId = await axios
        .post(`${config.API_URL}/users/${user_id}/playlists`, playlistsConfig, {
          headers,
        })
        .then((res) => {
          return res.data.id;
        })
        .catch((error) => {
          throw error.response;
        });

      const uris = await Promise.all(
        artists.map(async (artist) => {
          const topTrackEndpoint = `${config.API_URL}/artists/${artist.id}/top-tracks?market=JP`;
          return await axios
            .get(topTrackEndpoint, { headers })
            .then((res) => res.data.tracks[0].uri)
            .catch((error) => {
              throw error.response;
            });
        })
        
      );

      // 曲のtrack uriを入れる
      const tracks2 = { uris };
      const responseStatus = await axios
        .post(`${config.API_URL}/playlists/${playlistId}/tracks`, tracks2, { headers })
        .then((res) => {
          return res.status;
        })
        .catch((error) => {
          throw error.response;
        });

      if (responseStatus === 201) {
        setFlag(true);
      }
    } catch(error) {
      const errorObject = JSON.stringify(error.data.error);
      const statusCode = error.data.error.status;

      let m = alertsByErrorCode(statusCode);
      alert(`${errorObject}\n\n${m}`);
      location.href = '/';
    }
  };

  function alertsByErrorCode(status) {
    const messagesByErrorCode = {
      400: 'アプリケーションのエラーが起きています。管理者へお問い合わせください。',
      401: 'アプリケーションのエラーが起きています。管理者へお問い合わせください。',
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
  }

  return (
    <div className={styles.container}>
      <Header currentPage={'artist'} />
      <main className={styles.main}>
        <section className={artistStyles.sec_artist}>
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
                onClick={createPlaylist}>
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
