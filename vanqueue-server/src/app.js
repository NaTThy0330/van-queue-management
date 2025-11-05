const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const routes = require('./routes');
const config = require('./config/env');
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const corsOptions =
  config.corsOrigins === '*'
    ? { origin: '*' }
    : {
        origin: config.corsOrigins,
        credentials: true,
      };

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

app.get('/', (req, res) => {
  res.json({
    name: 'Van Queue & Departure System API',
    status: 'ok',
  });
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
