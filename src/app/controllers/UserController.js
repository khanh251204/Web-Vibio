const User = require('../models/User');
const otpModel = require('../models/otp');
const bcrypt = require('bcryptjs');

class UserController {
    register(req, res) {
        res.render('UI/register', {layout: 'login', title: 'Login'});
    }
    login(req, res) {
        res.render('UI/login', {layout: 'login', title: 'Login'});
    }
    changePass(req, res) {
        const us = req.session.userId;
        res.render('UI/changePassword',{User:us});
    }
    async sendOTP(req,res){
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email là bắt buộc' });
        }
        const otp = otpModel.generateOTP();
        otpModel.storeOTP(email,otp) // Lưu OTP vào bộ nhớ (hoặc cơ sở dữ liệu)
        // Cấu hình email
        const mailOptions = {
            from: 'hoangkhanh06122004@gmail.com',
            to: email,
            subject: 'MÃ OTP CỦA BẠN',
            text: `Mã OTP của bạn là: ${otp}`,
        };
        otpModel.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            return res.status(500).json('Lỗi khi gửi OTP: ' + error.message);
            }
            res.status(200).json({ message: 'OTP đã được gửi đến email của bạn!' });
        });
    }
    async create(req, res, next) {
        const { username, password, email, telephone, role ,otp} = req.body;
        const isOTPValid = await otpModel.verifyOTP(email, otp);  // Kiểm tra OTP với email đã lưu
        if (!isOTPValid) {
            return res.status(400).json({
                 message: 'OTP không hợp lệ hoặc đã hết hạn' 
            });
        }
        // Kiểm tra dữ liệu đầu vào
        if (!username || !password || !email || !telephone) {
            return res.status(400).json({ 
                message: 'Tất cả các trường là bắt buộc.' 
            });
        }
        // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success:false,
                 message: 'Email của bạn đã được đăng ký.' 
            });
        }
            // Kiểm tra xem username đã tồn tại trong cơ sở dữ liệu chưa
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ 
                success:false, message: 'Username này đã được sử dụng.' 
            });
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
            await newUser.save();
            return res.json({
                success: true,
                message: 'Bạn đã đăng ký thành công.'
            });
        } catch (error) {
            console.error('Lỗi khi tạo người dùng:', error);
            return res.status(500).json({success: false, message: 'Lỗi khi tạo người dùng.' });
        }
    }
    // [POST] login
    async logined(req, res) {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Tên đăng nhập không tồn tại.' });
        }
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
        if (user.role !== 'admin'|| user.delete === true) {
            return res.json({ 
                success: false,
                 message: 'Bạn không có quyền truy cập hoặc là tài khoản của bạn của khóa.' 
            });
        }
        req.session.userInfo = {
            username: user.username, 
            email: user.email,   
            telephone: user.telephone,
            role: user.role  
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
    async user(req, res, next) {
        try {
            const users = await User.find();
            const us = await req.session.userInfo;
            if (!users) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
            }

            // Render trang news với tất cả người dùng
            return res.render('UI/User', { users, User:us });
        } catch (error) {
            console.error('Lỗi khi truy vấn người dùng:', error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu người dùng.' });
        }
    }
    // Khóa người dùng
    async lockUser(req, res) {
        const { id } = req.params; // Lấy id người dùng từ tham số URL
        // const loggedInUserId = req.user._id;
        try {
            if (id === req.session.userId) {
                return res.json({ 
                    success: false, message: 'Bạn không thể xóa chính mình.' 
                });
            }
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).send('Không tìm thấy người dùng');
            }
            // Cập nhật thuộc tính 'delete' của người dùng thành true
            user.delete = true;
            // Lưu lại đối tượng người dùng đã cập nhật
            await user.save();
            res.redirect('/user');
        } catch (error) {
            console.error('Lỗi khi cập nhật người dùng:', error);
            res.status(500).send('Có lỗi xảy ra khi cập nhật người dùng');
        }
    }
    async unLockUser(req, res) {
        const { id } = req.params;
        try {
             // Kiểm tra nếu người dùng đang cố gắng xóa chính mình (admin không thể xóa chính mình)
            if (id === req.session.userId) {
                return res.json({ success: false, message: 'Bạn không thể xóa chính mình.' });
            }
            const user = await User.findById(id);
            
            if (!user) {
                return res.status(404).send('Không tìm thấy người dùng');
            }
            user.delete = false;
            await user.save();
            res.redirect('/user');
        } catch (error) {
            console.error('Lỗi khi cập nhật người dùng:', error);
            res.status(500).send('Có lỗi xảy ra khi cập nhật người dùng');
        }
    }

    // CẦN NGHIÊN CỨU THÊM

    // Đổi password 
    async changePassword(req, res) {
        const { password, newPassword } = req.body; // Lấy password từ form  
        const user = await User.findById(req.session.userId);
        try {
            // Kiểm tra mật khẩu
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false, message: 'Mật khẩu không đúng.' 
                });
            }
            // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();
            // Chuyển hướng về trang danh sách người dùng
            return res.json({
                success: true, message: 'Đổi mật khẩu thành công.' 
            });
        }
        catch (error) {
            console.error('Lỗi khi cập nhật mật khẩu:', error);
            res.status(500).json({success: false,message: 'Có lỗi xảy ra khi cập nhật mật khẩu'});
        }
    }
        async editUser(req, res, next) {
            const { id } = req.params;
            try {
                const user = await User.findById(id);
                if (!user) {
                    return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
                }
                return res.render('UI/editUser', { user });
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng để sửa:', error);
                return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu người dùng để sửa.' });
            }
        }
        async updateUser(req, res, next) {
            const { id } = req.params;  // Nhận ID người dùng từ tham số URL
            const { username, email, telephone, role } = req.body; // Lấy dữ liệu từ form sửa
            try {
                await User.findByIdAndUpdate(
                    id, 
                    { 
                        username,
                        email,
                        telephone,
                        role 
                    });
                res.redirect('/user');
            } catch (error) {
                console.error('Lỗi khi cập nhật thông tin người dùng:', error);
                return res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng.' });
            }
        }
}

module.exports = new UserController();
