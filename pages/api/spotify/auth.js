import axios from 'axios'

export default async (req, res) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  const endpoint = 'https://accounts.spotify.com/api/token';
  const response = await axios.post(endpoint, params, {headers: {
      'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`, 'utf-8').toString('base64')}`,
    }
  });

  res.end(JSON.stringify({access_token: response.data.access_token}))
};
