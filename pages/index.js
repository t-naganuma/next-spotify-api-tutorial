import axios from 'axios';
import React, { useEffect } from 'react';
import Link from 'next/link';
import config from '../config';
import styles from '../styles/layout/Layout.module.scss';
import buttonStyles from '../styles/components/Button.module.scss';
import auth from '../lib/auth.js';

export default function index() {
  useEffect(() => {
    const getAccessToken = async () => {
      const endpoint = `${config.BASE_URL}/api/spotify/getAccessToken`;
      const params = {
        code: new URL(window.location.href).searchParams.get('code'),
      };
      // params.codeに値が無ければreturn
      if (! params.code) return;

      const response = await axios
        .get(endpoint, { params })
        .then((res) => res.data.data)
        .catch((error) => {
          const statusCode = error.response.status;
          if (statusCode === 500) {
            alert('Spotifyのサーバーで障害が起きています。復旧までお待ちください。');
            return false;
          }
        });
      // localStorageにTokenをセット
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);

      // Tokenの有効期限を時間に直してセット
      const now = new Date();
      const expiration = response.expires_in / 60 / 60;
      now.setHours(now.getHours() + expiration);
      localStorage.setItem('expiredAt', now);

      // ブラウザURL部分のクエリを削除
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      url.searchParams.delete('state');
      history.pushState({}, '', url);
    };
    getAccessToken();
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.sec_top}>
          <h1 className={styles.heading1}>Spellista</h1>
          <div className={buttonStyles.loginWrap}>
            <button
              className={`${buttonStyles.button} ${buttonStyles.login}`}
              onClick={auth}>
              Sign in with Spotify
            </button>
          </div>
          <div className={buttonStyles.buttonWrap}>
            <Link href="/artist">
              <button className={`${buttonStyles.button} ${buttonStyles.link}`}>
                Top Artist
              </button>
            </Link>
            <Link href="/tracks">
              <button className={`${buttonStyles.button} ${buttonStyles.link}`}>
                Top Tracks
              </button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
