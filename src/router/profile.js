// routes/managerRoutes.js
const express = require('express');
const router = express.Router();
const {checkLogin2} = require('../middlewares/auth'); // Import middleware kiểm tra đăng nhập
const managerController = require('../app/controllers/ProfileController');


// Sử dụng middleware checkLogin để bảo vệ route /manager
router.get('/profile', checkLogin2, managerController.profile);

module.exports = router;
