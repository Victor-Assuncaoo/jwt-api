const { Router } = require('express');
const router = Router();
const categoryController = require('./category.controller');
const { verifyToken, verifyAdmin } = require('../auth/auth.middleware');

router.get('/', verifyToken, categoryController.findAll);
router.get('/:id', verifyToken, categoryController.findById);
router.post('/', verifyToken, verifyAdmin, categoryController.create);
router.put('/:id', verifyToken, verifyAdmin, categoryController.update);
router.delete('/:id', verifyToken, verifyAdmin, categoryController.delete);

module.exports = router;
