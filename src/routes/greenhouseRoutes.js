const { Router } = require('express');
const greenhouseController = require('../controllers/greenhouseController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', verifyToken, greenhouseController.getAllGreenhouses);
router.get('/:id', verifyToken, greenhouseController.getGreenhouseById);
router.post('/',verifyToken, greenhouseController.createGreenhouse);
router.put('/:id', verifyToken, greenhouseController.updateGreenhouse);
router.patch('/:id', verifyToken, greenhouseController.partialUpdateGreenhouse);
router.delete('/:id', verifyToken, greenhouseController.deleteGreenhouse);

module.exports = router;