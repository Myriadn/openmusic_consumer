/* eslint-disable camelcase */

// Mapper untuk mengubah data lagu dari format database ke model
const mapDBToModelSong = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

// Mapper untuk mengubah data playlist dari format database ke model
const mapDBToPlaylistModel = ({ id, name }) => ({
  id,
  name,
});

module.exports = {
  mapDBToModelSong,
  mapDBToPlaylistModel,
};
