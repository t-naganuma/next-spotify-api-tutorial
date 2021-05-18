import axios from 'axios'
import React from 'react';

export default function index() {
  const [artists, setArtists] = React.useState([]);
  const auth = () => {
    const endpoint = 'http://localhost:3000/api/spotify/auth';
    axios.get(endpoint)
      .then(res => {
        localStorage.setItem('accessToken', res.data.access_token);
      });
  }

  const getArtists = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (! accessToken) {
      alert('アクセストークンが無効です');
      return;
    }

    const endpoint = 'https://api.spotify.com/v1/artists';
    axios.get(endpoint, {
      params: {
        ids: '0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin',
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    }).then(res => {
      setArtists(res.data.artists);
    });
  }

  return (
    <>
      <button onClick={auth}>auth</button>
      <button onClick={getArtists}>get artists</button>
      {artists.map((artist) => {
        return <p key={artist.id}>{artist.name}</p>
      })}
    </>
  )
}
