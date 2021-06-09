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
  }, []);

  const getArtistByTerm = (term) => {
    const accessToken = localStorage.getItem('accessToken');
    const endpoint = `https://api.spotify.com/v1/me/top/artists?time_range=${term}`;
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
    const endpoint = 'https://api.spotify.com/v1/me';
    const headers = { Authorization: `Bearer ${accessToken}` };
    const user_id = await axios.get(endpoint, { headers }).then((res) => {
      return res.data.id;
    });

    const data = {
      name: 'New playlist',
      description: 'New Playlist',
      public: true,
    };
    const playlistId = await axios
      .post(`https://api.spotify.com/v1/users/${user_id}/playlists`, data, {
        headers,
      })
      .then((res) => {
        return res.data.id;
      })
      .catch((error) => {
        console.log(error);
      });

    const tracks = {
      uris: [
        'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
        'spotify:track:1301WleyT98MSxVHPZCA6M',
        'spotify:episode:512ojhOuo1ktJprKbVcKyQ',
      ],
    };
    await axios
      .post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        tracks,
        {
          headers,
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className={styles.container}>
      <main>
        <section className={contentStyles.sec_top}>
          {/* <Image
            src="/artist.jpg"
            alt="Top Artist Page"
            width={1000}
            height={600}
          /> */}
          <h1 className={contentStyles.heading1}>Top Artists</h1>
          <button className={buttonStyles.button} onClick={createPlaylist}>
            Create Playlist
          </button>
          <button
            className={buttonStyles.button}
            onClick={() => getArtistByTerm('short_term')}>
            short term
          </button>
          <button
            className={buttonStyles.button}
            onClick={() => getArtistByTerm('medium_term')}>
            medium term
          </button>
          <button
            className={buttonStyles.button}
            onClick={() => getArtistByTerm('long_term')}>
            long term
          </button>
          <ul>{displayArtists}</ul>
        </section>
      </main>
    </div>
  );
}
