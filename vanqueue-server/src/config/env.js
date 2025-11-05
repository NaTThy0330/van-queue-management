const Joi = require('joi');
const dotenv = require('dotenv');

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().default(4000),
  MONGODB_URI: Joi.string().uri({ scheme: ['mongodb', 'mongodb+srv'] }).required(),
  JWT_SECRET: Joi.string().min(10).required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  CORS_ORIGINS: Joi.string().default('*'),
  ADMIN_DEFAULT_EMAIL: Joi.string().email().required(),
  ADMIN_DEFAULT_PASSWORD: Joi.string().min(8).required(),
}).unknown();

const { value: envVars, error } = envSchema.validate(process.env, { abortEarly: false });

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

function parseCorsOrigins(value) {
  if (value === '*') return '*';
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

module.exports = {
  nodeEnv: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoUri: envVars.MONGODB_URI,
  jwtSecret: envVars.JWT_SECRET,
  jwtExpiresIn: envVars.JWT_EXPIRES_IN,
  corsOrigins: parseCorsOrigins(envVars.CORS_ORIGINS),
  adminDefaultEmail: envVars.ADMIN_DEFAULT_EMAIL,
  adminDefaultPassword: envVars.ADMIN_DEFAULT_PASSWORD,
};
