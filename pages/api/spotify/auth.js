import axios from 'axios'

export default async (req, res) => {
  const params = new URLSearchParams();
  const scopes = 'user-read-recently-played user-top-read playlist-modify-public streaming'
  params.append('client_id', process.env.CLIENT_ID);
  params.append('response_type', 'code');
  params.append('redirect_uri', 'http://localhost:3000');
  params.append('scope', scopes);
  params.append('state', 'state');
  const endpoint = 'https://accounts.spotify.com/authorize';
  const response = await axios.get(endpoint, {params});

  res.end(JSON.stringify({redirect_url: response.request.path}))
};
