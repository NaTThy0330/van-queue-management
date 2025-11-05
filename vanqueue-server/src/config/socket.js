const { Server } = require('socket.io');
const logger = require('../utils/logger');
const config = require('./env');

let ioInstance;

function initSocket(server) {
  ioInstance = new Server(server, {
    cors: {
      origin: config.corsOrigins,
      credentials: true,
    },
  });

  ioInstance.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);
    socket.on('disconnect', () => logger.info(`Socket disconnected: ${socket.id}`));
  });

  logger.info('Socket.IO initialized');
  return ioInstance;
}

function getIO() {
  if (!ioInstance) {
    throw new Error('Socket.IO not initialized');
  }
  return ioInstance;
}

module.exports = {
  initSocket,
  getIO,
};
