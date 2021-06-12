import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import checkExpiration from '../lib/checkExpiration';
import styles from '../styles/layout/Layout.module.scss';
import contentStyles from '../styles/layout/Content.module.scss';
import artistStyles from '../styles/layout/Artist.module.scss';
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
      axios.get(endpoint, { headers })
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
    const headers = { Authorizatiopn: `Bearer ${accessToken}` };
    axios.get(endpoint, { headers })
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
    const playlistId = await axios.post(`https://api.spotify.com/v1/users/${user_id}/playlists`, data, { headers })
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
    await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, tracks, { headers })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={styles.container}>
      <header>
        <nav className={contentStyles.nav}>
          <div className={contentStyles.nav_container}>
            <h1 className={artistStyles.heading1}>Top Artists</h1>
            <div>
              <ul className={contentStyles.nav_lists}>
                <li className={contentStyles.nav_list}>
                  <Link href="/">Top</Link>
                </li>
                <li
                  className={`${contentStyles.nav_list} ${contentStyles.active}`}>
                  <Link href="/artist">Artist</Link>
                </li>
                <li className={contentStyles.nav_list}>
                  <Link href="/track">Tracks</Link>
                </li>
                <li className={contentStyles.nav_list}>
                  <Link href="/recent">Recent</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
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
    </div>
  );
}
