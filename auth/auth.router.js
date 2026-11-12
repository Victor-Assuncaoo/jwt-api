const { Router } = require('express');
const router = Router();

const authController = require('./auth.controller'); 
const authMiddleware = require('./auth.middleware');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authMiddleware.verifyToken, authController.refreshToken);
router.get('/me', authMiddleware.verifyToken, authController.me);
module.exports = router;