const { Router } = require('express');
const controller = require('../controllers/locationController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', verifyToken, controller.getAllLocations);
router.get('/:id',verifyToken, controller.getLocationById);
router.post('/', verifyToken, controller.createLocation);
router.put('/:id',verifyToken, controller.updateLocation);
router.delete('/:id',verifyToken, controller.deleteLocation);

module.exports = router;