import axios from 'axios';
import config from '../../../config/index.js';

export default async (req, res) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append(
    'refresh_token',
    new URL(config.BASE_URL + req.url).searchParams.get('refresh_token')
  );
  const endpoint = 'https://accounts.spotify.com/api/token';
  const response = await axios.post(endpoint, params, {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
        'utf-8'
      ).toString('base64')}`,
    },
  });
  res.end(JSON.stringify({ data: response.data }));
};
