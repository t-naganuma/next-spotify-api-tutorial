import axios from 'axios';
import config from '../config';

const auth = () => {
  const endpoint = `${config.BASE_URL}/api/spotify/auth`;
  axios.get(endpoint).then((res) => {
    window.location.href =
      'https://accounts.spotify.com' + res.data.redirect_url;
  }).catch((error) => {
    console.log(error);
    alert('致命的なエラーです。サーバー管理者にお問い合わせください。');
  });
};

export default auth;
