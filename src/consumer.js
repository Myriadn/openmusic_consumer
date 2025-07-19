require('dotenv').config();

const amqplib = require('amqplib');
const PlaylistsService = require('./services/postgres/PlaylistService');
const MailSender = require('./services/mail/MailSender');

const init = async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();

  const connection = await amqplib.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  const queue = 'export:playlists';

  await channel.assertQueue(queue, {
    durable: true,
  });

  await channel.consume(
    queue,
    async (message) => {
      try {
        const { playlistId, targetEmail } = JSON.parse(
          message.content.toString(),
        );

        const songs = await playlistsService.getSongsFromPlaylist(playlistId);
        const playlist = await playlistsService.getPlaylistById(playlistId);

        const result = await mailSender.sendEmail(
          targetEmail,
          JSON.stringify({ playlist: { ...playlist, songs } }),
        );

        console.log(`Email terkirim ke ${targetEmail}`, result);
      } catch (error) {
        console.error(error);
      } finally {
        // Menandai pesan sebagai telah selesai diproses
        channel.ack(message);
      }
    },
    { noAck: false },
  ); // noAck: false agar kita bisa acknowledge secara manual
};

init();
