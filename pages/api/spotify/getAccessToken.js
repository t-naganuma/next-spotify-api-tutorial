import axios from 'axios';
import config from '../../../config/index.js';

export default async (req, res) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  // params.append(
  //   'code',
  //   new URL(config.BASE_URL + req.url).searchParams.get('code')
  // );
  params.append(
    'code',
    new URL(config.APP_URL + req.url).searchParams.get('code')
  );
  params.append('redirect_uri', config.BASE_URL);
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
