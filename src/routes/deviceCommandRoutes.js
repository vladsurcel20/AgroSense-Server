const express = require('express');
const router = express.Router();
const deviceCommandsController = require('../controllers/deviceCommandsController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, deviceCommandsController.getDeviceCommands);

module.exports = router;