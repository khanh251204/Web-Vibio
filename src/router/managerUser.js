const express = require('express');
const router = express.Router();
const newController = require('../app/controllers/ManagerUseController');
const { checkLogin2, checkAdmin } = require('./auth');

// Route Hiển thị danh sách người dùng
router.get('/news', checkLogin2,checkAdmin, newController.user);

// Route xóa người dùng
router.post('/newDelete/:id', checkLogin2, newController.deleteUser);

// Route hiển thị form sửa người dùng
router.get('/news/:id', checkLogin2, newController.editUser);

// Route cập nhật thông tin người dùng
router.post('/newEdit/:id', checkLogin2, newController.updateUser);
// 
module.exports = router;
