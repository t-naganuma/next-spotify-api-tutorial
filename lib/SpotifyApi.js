import axios from 'axios';
import config from '../config';

export class SpotifyApi {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
    this.headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    };
    this.userId = null;
    this.playlistId = null;
  }

  // Spotify UserID 取得
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

  // SpotifyのUserアカウントに空のplaylistを作成しIDを取得
  async getPlaylistId(playlistsConfig) {
    if (!this.userId) {
      await this.getUserId();
    }

    return await axios
      .post(
        `${config.API_URL}/users/${this.userId}/playlists`,
        playlistsConfig,
        {
          headers: this.headers,
        }
      )
      .then((res) => {
        this.playlistId = res.data.id;
        return res.data.id;
      })
      .catch((error) => {
        throw error.response;
      });
  }

  // artists情報をもとに曲のURIを取得
  async getArtistTrackUris(artists) {
    const uris = await Promise.all(
      artists.map(async (artist) => {
        const topTrackEndpoint = `${config.API_URL}/artists/${artist.id}/top-tracks?market=JP`;
        return await axios
          .get(topTrackEndpoint, { headers: this.headers })
          .then((res) => res.data.tracks[0].uri)
          .catch((error) => {
            throw error.response;
          });
      })
    );
    return { uris };
  }

  // 曲の情報をもとにURI取得
  async getTopTrackUris(tracks) {
    const uris = await tracks.map((track) => {
      return track.uri;
    });
    return { uris };
  }

  // playlistを作成する
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

  // 一覧表示されている曲を再生する
  async playTrack(deviceId, track) {
    return await axios
      .put(
        `${config.API_URL}/me/player/play?device_id=${deviceId}`,
        { uris: [track.uri] },
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
