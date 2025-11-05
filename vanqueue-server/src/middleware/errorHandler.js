const logger = require('../utils/logger');

// Central error handler keeps consistent response shape.
module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.message;
  }

  const payload = {
    success: false,
    message,
  };

  if (err.details) {
    payload.details = err.details;
  }

  logger.error(`HTTP ${statusCode} - ${payload.message}`, err.stack);
  res.status(statusCode).json(payload);
};
