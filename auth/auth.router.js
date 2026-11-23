const { Router } = require('express');
const router = Router();
const authController = require('./auth.controller');
const { verifyToken } = require('./auth.middleware');

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', verifyToken, authController.logout);
router.get('/me', verifyToken, authController.me);

module.exports = router;
