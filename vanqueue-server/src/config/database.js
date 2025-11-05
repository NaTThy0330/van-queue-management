const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('./env');

mongoose.set('strictQuery', true);

async function connectDatabase() {
  try {
    await mongoose.connect(config.mongoUri, {
      autoIndex: config.nodeEnv !== 'production',
    });
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

module.exports = {
  connectDatabase,
};
