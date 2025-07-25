/* eslint-disable no-underscore-dangle */
class Listener {
  constructor(playlistsService, mailSender) {
    this._playlistsService = playlistsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(
        message.content.toString(),
      );

      const playlist = await this._playlistsService.getPlaylistById(playlistId);
      const songs = await this._playlistsService.getSongsFromPlaylist(playlistId);
      playlist.songs = songs;

      const result = await this._mailSender.sendEmail(
        targetEmail,
        JSON.stringify({ playlist }),
      );

      console.log(`Email terkirim ke ${targetEmail}`, result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;
