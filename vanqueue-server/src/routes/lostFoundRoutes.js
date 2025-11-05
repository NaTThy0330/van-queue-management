const express = require('express');
const { authenticate } = require('../middleware/auth');
const lostFoundController = require('../controllers/lostFoundController');

const router = express.Router();

router.use(authenticate);
router.get('/', lostFoundController.listLostFound);

module.exports = router;
