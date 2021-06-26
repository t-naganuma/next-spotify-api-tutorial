import axios from 'axios';
import config from '../config';

// TODO accssToken, headersを共通化する
module.exports.getUserId = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const headers = { Authorization: `Bearer ${accessToken}` };

  const endpoint = `${config.API_URL}/me`;
  const user_id = await axios
    .get(endpoint, { headers })
    .then((res) => {
      return res.data.id;
    })
    .catch((error) => {
      throw error.response;
    });
    return user_id;
}

module.exports.getPlaylistId = async (user_id) => {
  const accessToken = localStorage.getItem('accessToken');
  const headers = { Authorization: `Bearer ${accessToken}` };
  
  const playlistsConfig = {
    name: 'Playlists of your favorite tracks',
    description: 'Playlists of your favorite tracks',
    public: true,
  };

  return await axios
    .post(`${config.API_URL}/users/${user_id}/playlists`, playlistsConfig, {
      headers,
    })
    .then((res) => {
      return res.data.id;
    })
    .catch((error) => {
      throw error.response;
    });
}

module.exports.createPlaylist = async (playlistId, tracks_uri) => {
  const accessToken = localStorage.getItem('accessToken');
  const headers = { Authorization: `Bearer ${accessToken}` };

  return await axios
    .post(
      `${config.API_URL}/playlists/${playlistId}/tracks`,
      tracks_uri,
      {
        headers,
      }
    )
    .then((res) => {
      return res.status;
    })
    .catch((error) => {
      throw error.response;
    });
}