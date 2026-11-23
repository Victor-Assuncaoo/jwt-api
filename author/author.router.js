const { Router } = require('express');
const router = Router();
const authorController = require('./author.controller');
const { verifyToken, verifyAdmin } = require('../auth/auth.middleware');

router.get('/', verifyToken, authorController.findAll);
router.get('/:id', verifyToken, authorController.findById);
router.post('/', verifyToken, verifyAdmin, authorController.create);
router.put('/:id', verifyToken, verifyAdmin, authorController.update);
router.delete('/:id', verifyToken, verifyAdmin, authorController.delete);

module.exports = router;
