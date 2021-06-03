import React, { useState } from 'react';
import axios from 'axios';
import checkExpiration from '../lib/checkExpiration';
import styles from '../styles/layout/Layout.module.scss';
import contentStyles from '../styles/layout/Content.module.scss';
import buttonStyles from '../styles/components/Button.module.scss';

export default function artist() {
  const { artists, setArtists } = useState([]);
  const getArtist = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert(
        'アクセストークンが取得できていません。\nauthボタンを押して認証し直してください。'
      );
      return;
    }
    checkExpiration();

    // Spotify ユーザーのTOP Artist取得
    const endpoint = 'https://api.spotify.com/v1/me/top/artists';
    const headers = { Authorization: `Bearer ${accessToken}` };
    axios
      .get(endpoint, { headers })
      .then((res) => {
        setArtists(res.data.items);
      })
      .catch((error) => {
        console.log(error);
        alert(
          'アクセストークンが無効です。\nauthボタンを押して認証し直すか、refresh access tokenボタンを押してトークンを更新してください。'
        );
      });
  };

  return (
    <div className={styles.container}>
      <main>
        <section className={contentStyles.sec_top}>
          <h1 className={contentStyles.heading1}>Top Artists</h1>
          <div className={buttonStyles.buttonWrap}>
            <button
              className={`${buttonStyles.button} ${buttonStyles.link}`}
              onClick={getArtist}>
              Get Artist
            </button>
          </div>
          {/* <ul>{displayArtists}</ul> */}
        </section>
      </main>
    </div>
  );
}
