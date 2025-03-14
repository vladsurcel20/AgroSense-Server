const { Router } = require('express');
const controller = require('../controllers/userController');

const router = Router();

router.get('/', controller.getAllUsers);
router.post('/', controller.createUser);

module.exports = router;