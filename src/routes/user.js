const express = require('express')
const router = express.Router()
const userController = require('../app/controllers/UserController');
const verifyAccessToken = require('../app/middlewares/verifyToken')

router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;