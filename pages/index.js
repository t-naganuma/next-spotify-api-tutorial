import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/layout/Layout.module.scss';
import topStyles from '../styles/layout/Top.module.scss';
import buttonStyles from '../styles/components/Button.module.scss';
import auth from '../lib/auth.js';
import checkExpiration from '../lib/checkExpiration.js';

export default function index() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const getAccessToken = async () => {
      const endpoint = 'http://localhost:3000/api/spotify/getAccessToken';
      const params = {
        code: new URL(window.location.href).searchParams.get('code'),
      };
      // params.codeに値が無ければreturn
      if (! params.code) return;

      const response = await axios
        .get(endpoint, { params })
        .then((res) => res.data.data);
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

  // APIを叩いて結果をstateに格納する
  const getTracks = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert(
        'アクセストークンが取得できていません。\nauthボタンを押して認証し直してください。'
      );
      return;
    }
    // Token有効期限チェック
    checkExpiration();

    const endpoint = 'https://api.spotify.com/v1/me/top/tracks';
    const headers = { Authorization: `Bearer ${accessToken}` };
    axios
      .get(endpoint, { headers })
      .then((res) => {
        setTracks(res.data.items);
      })
      .catch((error) => {
        console.log(error);
        // エラーは401と決めうち
        alert(
          'アクセストークンが無効です。\nauthボタンを押して認証し直すか、refresh access tokenボタンを押してトークンを更新してください。'
        );
      });
  };

  const displayTracks = tracks.map((track) => {
    return (
      <li key={track.id}>
        {track.name}
        <img src={track.album.images[0].url} alt="" />
      </li>
    );
  });

  return (
    <div className={styles.container}>
      <main>
        <section className={topStyles.sec_top}>
          <h1 className={topStyles.heading1}>Create Playlists App</h1>
          <div className={buttonStyles.buttonWrap}>
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
            <button
              className={`${buttonStyles.button} ${buttonStyles.link}`}
              onClick={getTracks}>
              Top Tracks
            </button>
          </div>
          <ul>{displayTracks}</ul>
        </section>
      </main>
    </div>
  );
}
