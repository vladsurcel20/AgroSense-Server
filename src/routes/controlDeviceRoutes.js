const express = require('express');
const router = express.Router();
const controlDevicesController = require('../controllers/controlDevicesController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, controlDevicesController.getDevices);
router.get('/:id', verifyToken, controlDevicesController.getDevices);
router.post('/', verifyToken, controlDevicesController.createDevice);
router.put('/:id', verifyToken, controlDevicesController.updateDevice);
router.delete('/:id', verifyToken, controlDevicesController.deleteDevice);

module.exports = router;