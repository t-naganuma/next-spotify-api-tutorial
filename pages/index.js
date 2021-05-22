import axios from 'axios'
import React from 'react';

export default function index() {
  const [yourName, setYourName] = React.useState('');
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
  const getProfile = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (! accessToken) {
      alert('アクセストークンが無効です');
      return;
    }

    const endpoint = 'https://api.spotify.com/v1/me';
    const headers = {'Authorization': `Bearer ${accessToken}`,};
    axios.get(endpoint, {headers})
      .then(res => {
        setYourName(res.data.display_name);
      });
  }

  return (
    <>
      <button onClick={auth}>auth</button>
      <button onClick={getAccessToken}>get access token</button>
      <button onClick={getProfile}>get profile</button>
      {yourName ? <p>あなたの名前は {yourName} ですね！</p> : <></>}
    </>
  )
}
