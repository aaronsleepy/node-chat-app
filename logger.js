const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.timestamp(),
  transports: [
    // new transports.File({ filename: 'combined.log' }),
    // new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.Console({ format: format.simple() })
  ],
});

module.exports = logger;