const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');
const {checkLogin, checkLogin2} = require('../middlewares/auth');





// Route cho trang đăng kýT để hiển thị form đăng ký

router.get('',checkLogin, userController.login);
router.get('/register',checkLogin, userController.register);
router.get('/changePassword',checkLogin, userController.changePass);



// Route cho việc tạo người dùng
router.post('/create', userController.create); // Sử dụng POST để xử lý dữ liệu từ form
router.post('/sendOTP', userController.sendOTP); // Sử dụng POST để xử lý dữ liệu từ form
router.post('/login', userController.logined); // Sử dụng POST để xử lý dữ liệu từ form
router.post('/logout', userController.logout);
router.post('/exchangePassword', checkLogin, userController.changePassword);






// Route Hiển thị danh sách người dùng
router.get('/user', checkLogin2, userController.user);

// Route khóa người dùng
router.post('/lock/:id', checkLogin2, userController.lockUser);
// Route mở khóa người dùng
router.post('/unLock/:id', checkLogin2, userController.unLockUser);

// Route hiển thị form sửa người dùng
router.get('/news/:id', checkLogin2, userController.editUser);

// Route cập nhật thông tin người dùng
router.post('/newEdit/:id', checkLogin2, userController.updateUser);
module.exports = router;
