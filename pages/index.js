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
      <button onClick={getArtists}>get artists</button>
      {/* stateに格納されたアーティストを表示する */}
      {artists.map((artist) => {
        return <p key={artist.id}>{artist.name}</p>
      })}
    </>
  )
}
