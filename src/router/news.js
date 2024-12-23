const express = require('express');
const router = express.Router();
const newController = require('../app/controllers/NewController');
const { checkLogin2 } = require('./auth');

// Route Hiển thị danh sách người dùng
router.get('/news', checkLogin2, newController.news);

// Route xóa người dùng
router.post('/newdelete/:id', checkLogin2, newController.deleteUser);

// Route hiển thị form sửa người dùng
// router.get('/news/:userId', checkLogin2, newController.editUser);

// Route cập nhật thông tin người dùng
// router.post('/news/:userId', checkLogin2, newController.updateUser);
// 
module.exports = router;
