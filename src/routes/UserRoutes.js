const express = require('express');
const UserController = require('../controllers/UserController');
const authenticateToken  = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/v1/user/token', UserController.generateToken);
router.get('/v1/user/:id', UserController.getUserById);
router.get('/v1/user', UserController.getAllUsers);
router.post('/v1/user', authenticateToken, UserController.createUser);
router.put('/v1/user/:id', authenticateToken, UserController.updateUser);
router.delete('/v1/user/:id', authenticateToken,  UserController.deleteUser);

module.exports = router;
