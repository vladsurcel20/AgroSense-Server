const { Router } = require('express');
const controller = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', controller.getAllUsers);
router.post('/', controller.createUser);
router.get('/me', verifyToken, controller.findMe);

module.exports = router;