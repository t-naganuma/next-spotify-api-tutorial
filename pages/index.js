import axios from 'axios';
import React, { useState, useEffect } from 'react';

export default function index() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const getAccessToken = async () => {
      const endpoint = 'http://localhost:3000/api/spotify/getAccessToken';
      const params = {
        code: new URL(window.location.href).searchParams.get('code'),
      };
      if (params.code) {
        const response = await axios
          .get(endpoint, { params })
          .then((res) => res.data.data);
        localStorage.setItem('accessToken', response.access_token);
        localStorage.setItem('refreshToken', response.refresh_token);
        const url = new URL(window.location.href);
        url.searchParams.delete('code');
        url.searchParams.delete('state');
        history.pushState({}, '', url);
      }
    };
    getAccessToken();
  }, []);

  const auth = () => {
    const endpoint = 'http://localhost:3000/api/spotify/auth';
    axios.get(endpoint).then((res) => {
      window.location.href =
        'https://accounts.spotify.com' + res.data.redirect_url;
    });
  };

  const refreshAccessToken = async () => {
    if (!localStorage.getItem('refreshToken')) {
      alert(
        'リフレッシュトークンがありません。\nauthボタンを押して認証し直してください。'
      );
      return;
    }

    const endpoint = 'http://localhost:3000/api/spotify/refreshAccessToken';
    const params = { refresh_token: localStorage.getItem('refreshToken') };
    const response = await axios
      .get(endpoint, { params })
      .then((res) => res.data);
    localStorage.setItem('accessToken', response.accessToken);
    if (localStorage.getItem('accessToken')) {
      alert('アクセストークンを更新しました。');
      return;
    }
  };

  // APIを叩いて結果をstateに格納する
  const getArtist = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert(
        'アクセストークンが取得できていません。\nauthボタンを押して認証し直してください。'
      );
      return;
    }

    const endpoint = 'https://api.spotify.com/v1/me/top/artists';
    const headers = { Authorization: `Bearer ${accessToken}` };
    axios
      .get(endpoint, { headers })
      .then((res) => {
        console.log(res.data.items);
        setArtists(res.data.items);
      })
      .catch((error) => {
        console.log(error);
        // エラーは401と決めうち
        alert(
          'アクセストークンが無効です。\nauthボタンを押して認証し直すか、refresh access tokenボタンを押してトークンを更新してください。'
        );
      });
  };

  const displayArtists = () => {
    return artists.map((artist) => {
      return (
        <div>
          <p key={artist.id}>{artist.name}</p>
          <img src={artist.images[0].url} alt="" />
        </div>
      );
    });
  };

  return (
    <>
      <button onClick={auth}>auth</button>
      <button onClick={refreshAccessToken}>refresh access token</button>
      <button onClick={getArtist}>get artist</button>
      {displayArtists()}
    </>
  );
}
