import axios from 'axios';
import config from '../../../config/index.js';

const generateRandomString = (length) => {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export default async (req, res) => {
  const params = new URLSearchParams();
  const scopes =
    'user-read-private user-read-email user-read-recently-played user-top-read playlist-modify-public playlist-modify-private streaming';
  const state = generateRandomString(16);
  params.append('client_id', process.env.CLIENT_ID);
  params.append('response_type', 'code');
  params.append('redirect_uri', config.BASE_URL);
  params.append('scope', scopes);
  params.append('state', state);
  const endpoint = 'https://accounts.spotify.com/authorize';
  const response = await axios.get(endpoint, { params });

  res.end(JSON.stringify({ redirect_url: response.request.path }));
};
