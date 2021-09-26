const SocketIo = require('socket.io');
const logger = require('./logger');

module.exports = (server) => {
  const io = SocketIo(server, {
    path: '/path-to-socket.io',
  });

  io.on('connection', socket => {
    const req = socket.request;
    const clientIp = req.headers['x-forwared-for'] || req.connection.remoteAddress;
    logger.info(`New client connected from ${clientIp}, ${socket.id}, ${req.ip}`);

    socket.on('reply', data => {
      logger.info(`Received reply message ${data} from ${clientIp}`);
    });

    socket.on('error', error => {
      logger.error(`Error ${error} occurred from ${clientIp}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Connection closed from ${clientIp}, ${socket.id}`);
      clearInterval(socket.interval);
    });

    socket.interval = setInterval(() => {
      socket.emit('news', 'Message sent by server')
    }, 3000);
  });
};