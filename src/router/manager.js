// routes/managerRoutes.js
const express = require('express');
const router = express.Router();
const {checkLogin2} = require('../router/auth'); // Import middleware kiểm tra đăng nhập
const managerController = require('../app/controllers/ManagerController');


// Sử dụng middleware checkLogin để bảo vệ route /manager
router.get('/manager', checkLogin2, managerController.manager);

module.exports = router;
