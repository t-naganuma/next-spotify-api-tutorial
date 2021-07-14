import axios from 'axios';
import config from '../config';

const messagesByErrorCode = {
  400: 'アプリケーションのエラーが起きています。管理者へお問い合わせください。',
  401: 'アクセス権限がない、もしくは認証に失敗しています。\nログインしてください。',
  403: 'アプリケーションのエラーが起きています。管理者へお問い合わせください。',
  404: 'アプリケーションのエラーが起きています。管理者へお問い合わせください。',
  429: 'リクエストが多いため利用制限されています。時間をおいて再度お試しください。',
  500: 'Spotifyのサーバーで障害が起きています。復旧までお待ちください。',
  502: 'Spotifyのサーバーで障害が起きています。復旧までお待ちください。',
  503: 'Spotifyのサーバーで一時的な障害が起きています。時間をおいて再度お試しください。',
};

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

  async getTopArtistsByUser() {
    return await axios
      .get(`${config.API_URL}/me/top/artists`, { headers: this.headers })
      .then((res) => {
        return res.data.items;
      })
      .catch((error) => {
        return error.response.data;
      });
  }

  // ユーザーのTop Tracks取得
  async getTopTracksByUser() {
    return await axios
      .get(`${config.API_URL}/me/top/tracks`, { headers: this.headers })
      .then((res) => {
        return res.data.items;
      })
      .catch((error) => {
        return error.response.data;
      });
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

  // 期間ごとのartist, tracksの出しわけ
  async getDataByTerm(term, type) {
    let endpoint;
    switch(type) {
      case 'artists':
        endpoint = `${config.API_URL}/me/top/artists?time_range=${term}`;
        break;
      case 'tracks':
        endpoint = `${config.API_URL}/me/top/tracks?time_range=${term}`;
    };

    return await axios
      .get(endpoint, { headers: this.headers })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        const statusCode = error.response.status;
        let message = messagesByErrorCode[statusCode];
        alert(`${message}\n${error.response.status} ${error.response.message}`);
        return error.response.data
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
        const statusCode = error.response.status;
        let message = messagesByErrorCode[statusCode];
        alert(`${message}\n${error.response.status} ${error.response.data.error.message}`);
        location.href = "/";
        return;
      });
  }
}
