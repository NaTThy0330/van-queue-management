const express = require('express');
const Joi = require('joi');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

const tokenSchema = Joi.object({
  token: Joi.string().required(),
  platform: Joi.string().optional(),
});

router.use(authenticate);

router.post('/token', validate(tokenSchema), notificationController.registerToken);
router.delete('/token', validate(Joi.object({ token: Joi.string().required() })), notificationController.unregisterToken);

module.exports = router;
