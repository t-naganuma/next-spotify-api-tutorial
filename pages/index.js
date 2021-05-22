import axios from 'axios'
import React from 'react';

export default function index() {
  // APIで取得したアーティストをstateに格納するため
  const [artists, setArtists] = React.useState([]);

  // アクセストークンを取得し、ローカルストレージに保存する
  const auth = () => {
    const endpoint = 'http://localhost:3000/api/spotify/auth';
    axios.get(endpoint)
      .then(res => {
        window.location.href = 'https://accounts.spotify.com' + res.data.redirect_url;
      });
  }

  const getAccessToken = async () => {
    const endpoint = 'http://localhost:3000/api/spotify/getAccessToken';
    const params = {code: (new URL(window.location.href)).searchParams.get('code')};
    const response = await axios.get(endpoint, {params}).then(res => res.data.data);
    localStorage.setItem('accessToken', response.access_token);
    localStorage.setItem('refreshToken', response.refresh_token);
  }

  // APIを叩いて結果をstateに格納する
  const getArtists = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (! accessToken) {
      alert('アクセストークンが無効です');
      return;
    }

    const endpoint = 'https://api.spotify.com/v1/artists';
    const params = {ids: '0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin'};
    const headers = {'Authorization': `Bearer ${accessToken}`,};
    axios.get(endpoint, {params,headers})
      .then(res => {
        setArtists(res.data.artists);
      });
  }

  return (
    <>
      <button onClick={auth}>auth</button>
      <button onClick={getAccessToken}>get access token</button>
    </>
  )
}
