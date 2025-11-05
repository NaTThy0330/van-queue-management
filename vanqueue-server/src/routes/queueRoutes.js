const express = require('express');
const Joi = require('joi');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const queueController = require('../controllers/queueController');
const { upload } = require('../config/upload');

const router = express.Router();

const reserveSchema = Joi.object({
  tripId: Joi.string().hex().length(24).required(),
  queueType: Joi.string().valid('normal', 'standby').default('normal'),
  amount: Joi.number().positive().required(),
});

router.use(authenticate, authorize('passenger'));

router.post(
  '/reserve',
  upload.single('paymentSlip'),
  validate(reserveSchema),
  queueController.reserveQueue,
);

router.get('/status', queueController.listQueues);
router.get('/tickets/history', queueController.ticketHistory);

module.exports = router;
