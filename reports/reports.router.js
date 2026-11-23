const { Router } = require('express');
const router = Router();
const reportsController = require('./reports.controller');
const { verifyToken, verifyAdmin } = require('../auth/auth.middleware');

router.get('/dashboard', verifyToken, verifyAdmin, reportsController.dashboard);

module.exports = router;
