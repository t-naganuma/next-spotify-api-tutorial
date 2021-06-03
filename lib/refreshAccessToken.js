import axios from 'axios';

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
  localStorage.setItem('accessToken', response.data.access_token);

  // Tokenの有効期限を時間に直してセット
  const now = new Date();
  const expire = Number(response.data.expires_in);
  const expiration = expire / 60 / 60;
  now.setHours(now.getHours() + expiration);
  localStorage.setItem('expiredAt', now);
};

export default refreshAccessToken;
