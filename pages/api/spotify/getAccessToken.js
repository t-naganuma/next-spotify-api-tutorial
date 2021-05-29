import axios from 'axios'

export default async (req, res) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', (new URL('http://localhost:3000' + req.url)).searchParams.get('code'));
  params.append('redirect_uri', 'http://localhost:3000');
  const endpoint = 'https://accounts.spotify.com/api/token';
  const response = await axios.post(endpoint, params, {headers: {
      'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`, 'utf-8').toString('base64')}`,
    }
  });
  res.end(JSON.stringify({data: response.data}));
};
