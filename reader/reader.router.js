const { Router } = require('express');
const router = Router();
const readerController = require('./reader.controller');
const { verifyToken } = require('../auth/auth.middleware');

router.get('/', verifyToken, readerController.findAll);
router.get('/:id', verifyToken, readerController.findById);
router.get('/:id/loans', verifyToken, readerController.getLoanHistory);
router.post('/', verifyToken, readerController.create);
router.put('/:id', verifyToken, readerController.update);

module.exports = router;
