const http = require('http');
const app = require('./app');
const config = require('./config/env');
const { connectDatabase } = require('./config/database');
const { initSocket } = require('./config/socket');
const logger = require('./utils/logger');

async function bootstrap() {
  await connectDatabase();

  const server = http.createServer(app);
  initSocket(server);

  server.listen(config.port, () => {
    logger.info(`Server listening on port ${config.port}`);
  });

  const shutdown = () => {
    logger.info('Shutting down gracefully');
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', error);
    shutdown();
  });
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection', reason);
    shutdown();
  });
}

bootstrap();
