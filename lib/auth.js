import axios from 'axios';

const auth = () => {
  const endpoint = 'http://localhost:3000/api/spotify/auth';
  axios.get(endpoint).then((res) => {
    window.location.href =
      'https://accounts.spotify.com' + res.data.redirect_url;
  });
};

export default auth;
