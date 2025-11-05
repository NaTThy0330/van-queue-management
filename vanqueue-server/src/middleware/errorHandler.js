const logger = require('../utils/logger');

// Central error handler keeps consistent response shape.
module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.message || 'Internal server error',
  };

  if (err.details) {
    payload.details = err.details;
  }

  logger.error(`HTTP ${statusCode} - ${payload.message}`, err.stack);
  res.status(statusCode).json(payload);
};
