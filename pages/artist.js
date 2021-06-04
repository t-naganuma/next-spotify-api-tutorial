import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import checkExpiration from '../lib/checkExpiration';
import styles from '../styles/layout/Layout.module.scss';
import contentStyles from '../styles/layout/Content.module.scss';
import buttonStyles from '../styles/components/Button.module.scss';

export default function artist() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
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
    getArtist();
  },[]);

  const displayArtists = artists.map((artist, i) => {
    console.log(artist)
    return (
      <li key={artist.id} className={contentStyles.list}>
        <span className={contentStyles.order_number}>{i + 1}</span>
        <img className={contentStyles.img} src={artist.images[0].url} alt={artist.name} />
        <span className={contentStyles.artist_info}>
          <p className={contentStyles.content_name}>{artist.name}</p>
          <p className={contentStyles.genre_info}>{artist.genres}</p>
        </span>
      </li>
    );
  });

  return (
    <div className={styles.container}>
      <main>
        <section className={contentStyles.sec_top}>
          <Image src="/artist.jpg" alt="Top Artist Page" width={1000} height={600} />
          <h1 className={contentStyles.heading1}>Top Artists</h1>
          <ul>{displayArtists}</ul>
        </section>
      </main>
    </div>
  );
}
