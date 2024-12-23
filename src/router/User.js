const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');
// const {authenticate,authorize} = require('../router/auth');
const {checkLogin} = require('./auth');
// Route cho trang đăng ký
router.get('/register',checkLogin, userController.register); // Sử dụng GET để hiển thị form đăng ký
// router.get('/login',checkLogin, userController.login);
router.get('',checkLogin, userController.login);



// Route cho việc tạo người dùng
router.post('/create', userController.create); // Sử dụng POST để xử lý dữ liệu từ form
router.post('/login', userController.logined); // Sử dụng POST để xử lý dữ liệu từ form
router.post('/logout', userController.logout);
module.exports = router;
