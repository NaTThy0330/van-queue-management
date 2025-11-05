const express = require('express');
const Joi = require('joi');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{9,15}$/).required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('passenger', 'driver', 'admin').default('passenger'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
