const express = require('express');
const router = express.Router();
const sensorsController = require('../controllers/sensorsController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, sensorsController.getSensors);
router.get('/:id', verifyToken, sensorsController.getSensors);
router.post('/', verifyToken, sensorsController.createSensor);
router.patch('/:id', verifyToken, sensorsController.updateSensor);
router.delete('/:id', verifyToken, sensorsController.deleteSensor);

module.exports = router;