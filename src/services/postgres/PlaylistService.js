const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModelSong, mapDBToPlaylistModel } = require('../../utils');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(playlistId) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
             LEFT JOIN users ON users.id = playlists.owner
             WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return mapDBToPlaylistModel(result.rows[0]);
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
             JOIN playlist_songs ON songs.id = playlist_songs.song_id
             WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModelSong);
  }
}

module.exports = PlaylistsService;
