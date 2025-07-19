require('dotenv').config();

const amqplib = require('amqplib');
const PlaylistsService = require('./services/postgres/PlaylistService');
const MailSender = require('./services/mail/MailSender');
const Listener = require('./Listener');

const init = async () => {
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, mailSender);

  const connection = await amqplib.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  const queue = 'export:playlists';

  await channel.assertQueue(queue, {
    durable: true,
  });

  // Memproses pesan dengan listener.listen dan opsi noAck: true
  channel.consume(queue, listener.listen, { noAck: true });

  console.log(`Consumer sedang berjalan dan mendengarkan queue: ${queue}`);
};

init();
