const express = require('express');
const authRoutes = require('./authRoutes');
const healthRoutes = require('./healthRoutes');
const routeRoutes = require('./routeRoutes');
const queueRoutes = require('./queueRoutes');
const notificationRoutes = require('./notificationRoutes');
const lostFoundRoutes = require('./lostFoundRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/routes', routeRoutes);
router.use('/queue', queueRoutes);
router.use('/notifications', notificationRoutes);
router.use('/lostfound', lostFoundRoutes);

module.exports = router;
