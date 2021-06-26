import axios from 'axios';
import config from '../config';

// TODO accssToken, headersを共通化する
module.exports.getUserId = async (headers) => {
  return await axios
    .get(`${config.API_URL}/me`, { headers })
    .then((res) => {
      return res.data.id;
    })
    .catch((error) => {
      throw error.response;
    });
}

module.exports.getPlaylistId = async (headers, playlistsConfig, user_id) => {
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

module.exports.getArtistTrackUris = async (headers, artists) => {
  return await Promise.all(
    artists.map(async (artist) => {
      const topTrackEndpoint = `${config.API_URL}/artists/${artist.id}/top-tracks?market=JP`;
      return await axios
        .get(topTrackEndpoint, { headers })
        .then((res) => res.data.tracks[0].uri)
        .catch((error) => {
          throw error.response;
        });
    })
  );
}

module.exports.createPlaylist = async (headers, playlistId, tracks_uri) => {
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