const WebSocket = require('ws');
const logger = require('./logger');

module.exports = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws, req) => {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    logger.info(`New client connected from ${clientIp}`);

    ws.on('message', message => {
      logger.info(`Received message ${message} from ${clientIp}`);
    });

    ws.on('error', error => {
      logger.error(`Error ${error} occurred from ${clientIp}`);
    });

    ws.on('close', () => {
      logger.info(`Connection closed from ${clientIp}`);
      clearInterval(ws.interval);
    });

    ws.interval = setInterval(() => {
      if (ws.OPEN === ws.readyState) {
        ws.send('Messages sent by server');
      }
    }, 3000);
  });
};