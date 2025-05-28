const express = require('express');
const router = express.Router();
const cultureController = require('../controllers/cultureController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, cultureController.getAllCultures);
router.get('/:id', verifyToken, cultureController.getCultureById);
router.post('/', verifyToken, cultureController.createCulture);
router.patch('/:id', verifyToken, cultureController.patchCulture);
router.delete('/:id', verifyToken, cultureController.deleteCulture);


module.exports = router;