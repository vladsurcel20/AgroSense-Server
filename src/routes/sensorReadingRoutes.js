const express = require('express');
const router = express.Router();
const sensorReadingsController = require('../controllers/sensorReadingsController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, sensorReadingsController.getSensorReadings);
router.get('/chart', verifyToken, sensorReadingsController.getChartData);
router.get('/:greenhouseId/minmax', verifyToken, sensorReadingsController.getSensorMinMax);

module.exports = router;