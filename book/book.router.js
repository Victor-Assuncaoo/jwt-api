const { Router } = require('express');
const router = Router();
const bookController = require('./book.controller');
const { verifyToken, verifyAdmin } = require('../auth/auth.middleware');

router.get('/', verifyToken, bookController.findAll);
router.get('/:id', verifyToken, bookController.findById);
router.post('/', verifyToken, verifyAdmin, bookController.create);
router.put('/:id', verifyToken, verifyAdmin, bookController.update);
router.delete('/:id', verifyToken, verifyAdmin, bookController.delete);

module.exports = router;
