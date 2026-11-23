const { Router } = require('express');
const router = Router();
const userController = require('./user.controller');
const { verifyToken, verifyAdmin } = require('../auth/auth.middleware');

// Apenas admin pode criar, listar e gerenciar atendentes
router.post('/', verifyToken, verifyAdmin, userController.create);
router.get('/', verifyToken, verifyAdmin, userController.findAll);
router.get('/:id', verifyToken, verifyAdmin, userController.findById);
router.put('/:id', verifyToken, verifyAdmin, userController.update);
router.patch('/:id/active', verifyToken, verifyAdmin, userController.setActive);

module.exports = router;
