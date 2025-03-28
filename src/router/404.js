const express = require('express');
const router = express.Router();
const M404 = require('../app/controllers/404');
const {checkLogin} = require('../middlewares/auth');

// Sử dụng middleware checkLogin để bảo vệ route /manager
router.get('/404', checkLogin, M404.m404);

module.exports = router;
