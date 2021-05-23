import axios from 'axios'

export default async (req, res) => {
  const params = new URLSearchParams();
  params.append('client_id', process.env.CLIENT_ID);
  params.append('response_type', 'code');
  params.append('redirect_uri', 'http://localhost:3000');
  const endpoint = 'https://accounts.spotify.com/authorize';
  const response = await axios.get(endpoint, {params});

  res.end(JSON.stringify({redirect_url: response.request.path}))
};
