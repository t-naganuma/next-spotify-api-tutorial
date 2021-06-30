import axios from 'axios';
import config from '../config';

export class SpotifyApi {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
    this.headers = { Authorization: `Bearer ${this.accessToken}` };
    this.userId = null;
    this.playlistId = null;
  }

  async getUserId() {
    return await axios
      .get(`${config.API_URL}/me`, { headers: this.headers })
      .then((res) => {
        this.userId = res.data.id;
        return res.data.id;
      })
      .catch((error) => {
        throw error.response;
      });
  }

  async getPlaylistId() {
    if (!this.userId) {
      await this.getUserId();
    }

    const playlistsConfig = {
      name: 'Playlists of your favorite tracks',
      description: 'Playlists of your favorite tracks',
      public: true,
    };

    return await axios
      .post(`${config.API_URL}/users/${this.userId}/playlists`, playlistsConfig, {
        headers: this.headers,
      })
      .then((res) => {
        this.playlistId = res.data.id;
        return res.data.id;
      })
      .catch((error) => {
        throw error.response;
      });
  }

  // async getArtistTrackUris() {
  //   return await Promise.all(
  //     artists.map(async (artist) => {
  //       const topTrackEndpoint = `${config.API_URL}/artists/${artist.id}/top-tracks?market=JP`;
  //       return await axios
  //         .get(topTrackEndpoint, { headers })
  //         .then((res) => res.data.tracks[0].uri)
  //         .catch((error) => {
  //           throw error.response;
  //         });
  //     })
  //   );
  // }

  async createPlaylist(tracks_uri) {
    if (!this.playlistId) {
      await this.getPlaylistId();
    }

    return await axios
      .post(
        `${config.API_URL}/playlists/${this.playlistId}/tracks`,
        tracks_uri,
        { headers: this.headers }
      )
      .then((res) => {
        return res.status;
      })
      .catch((error) => {
        throw error.response;
      });
  }
}
