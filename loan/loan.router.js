const { Router } = require('express');
const router = Router();
const loanController = require('./loan.controller');
const { verifyToken } = require('../auth/auth.middleware');

router.get('/', verifyToken, loanController.findAll);
router.post('/', verifyToken, loanController.create);
router.patch('/:id/return', verifyToken, loanController.return);

module.exports = router;
