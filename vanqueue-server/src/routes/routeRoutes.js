const express = require('express');
const routeController = require('../controllers/routeController');

const router = express.Router();

router.get('/', routeController.listRoutes);
router.get('/:id/trips', routeController.listTripsByRoute);

module.exports = router;
