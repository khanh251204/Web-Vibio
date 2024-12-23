const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UserController {
    register(req, res) {
        res.render('UI/register', {layout: 'login', title: 'Login'});
    }
    login(req, res) {
        res.render('UI/login', {layout: 'login', title: 'Login'});
    }
    // [POST] register
        // Xử lý đăng ký người dùng
        async create(req, res, next) {
            const { username, password, email, telephone, role } = req.body;
            // Kiểm tra dữ liệu đầu vào
            if (!username || !password || !email || !telephone) {
                return res.status(400).json({ message: 'Tất cả các trường là bắt buộc.' });
            }
            try {
                // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
                const hashedPassword = await bcrypt.hash(password, 10);
                // Gán giá trị role từ body hoặc gán mặc định là 'user'
                const userRole = role || 'user'; // Nếu không có vai trò, mặc định là 'user'
                // Tạo mới người dùng và lưu vào cơ sở dữ liệu
                const newUser = new User({
                    username,
                    password: hashedPassword,
                    email,
                    telephone,
                    role: userRole,  // Gán vai trò người dùng
                });
                // Lưu người dùng vào cơ sở dữ liệu
                await newUser.save();
                // Điều hướng tới trang đăng nhập
                res.redirect('/');
            } catch (error) {
                console.error('Lỗi khi tạo người dùng:', error);
                return res.status(500).json({ message: 'Lỗi khi tạo người dùng.' });
            }
        }
    // [POST] login
    async logined(req, res) {
        const { username, password } = req.body;
        // Kiểm tra thông tin người dùng trong cơ sở dữ liệu (bạn có thể dùng mongoose hoặc database khác)
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Tên đăng nhập không tồn tại.' });
        }
        // Kiểm tra mật khẩu
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Mật khẩu không đúng.' });
        }
        // Lưu thông tin vào session hoặc JWT token
        req.session.loggedIn = true;
        // req.session.user = user.username; // Lưu thông tin người dùng vào session
        // req.session.email = user.email; // Lưu thông tin người dùng vào session
        // req.session.telephone = user.telephone; // Lưu thông tin người dùng vào session
        // req.session.role = user.role; // Lưu thông tin người dùng vào session
        req.session.userInfo = {
            username: user.username,   // Lưu tên người dùng từ cơ sở dữ liệu
            email: user.email,         // Lưu email từ cơ sở dữ liệu
            telephone: user.telephone, // Lưu số điện thoại từ cơ sở dữ liệu
            role: user.role            // Lưu quyền của người dùng từ cơ sở dữ liệu
        };
        req.session.userId = user._id;
        return res.json({ success: true, message: 'Đăng nhập thành công.' });
    }
    // [POST] logout
    async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Có lỗi xảy ra khi đăng xuất.' });
            }
            // Sau khi xóa session thành công, chuyển hướng về trang đăng nhập
            return res.redirect('/');
        });
    }
    

}

module.exports = new UserController();
