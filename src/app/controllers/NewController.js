const User = require("../models/User");

class NewController {
   

    // Hiển thị thông tin người dùng
    async news(req, res, next) {
        try {
            // Truy vấn tất cả người dùng từ MongoDB
            const users = await User.find();
            const us = await req.session.userInfo;
            // console.log(users);
            // Kiểm tra nếu không có người dùng
            if (!users) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
            }

            // Render trang news với tất cả người dùng
            return res.render('UI/news', { users,User:us });
        } catch (error) {
            console.error('Lỗi khi truy vấn người dùng:', error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu người dùng.' });
        }
    }
    // Xóa người dùng
    async deleteUser(req, res) {
        const { id } = req.params; // Lấy id người dùng từ tham số URL
        try {
          // Xóa người dùng
          const user = await User.findByIdAndDelete(id);
      
          if (!user) {
            return res.status(404).send('Không tìm thấy người dùng');
          }
      
          // Sau khi xóa thành công, chuyển hướng về trang chủ
          res.redirect('/news');
        } catch (error) {
          console.error('Lỗi khi xóa người dùng:', error);
          res.status(500).send('Có lỗi xảy ra khi xóa người dùng');
        }
      }
    
    


// CẦN NGHIÊN CỨU THÊM






    // Sửa thông tin người dùng
    async editUser(req, res, next) {
        const { id } = req.params;  // Nhận ID người dùng từ tham số URL

        try {
            // Lấy thông tin người dùng cần sửa
            const user = await User.findById(id);

            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
            }

            // Hiển thị form sửa với dữ liệu người dùng
            return res.render('UI/editUser', { user });
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng để sửa:', error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy dữ liệu người dùng để sửa.' });
        }
    }

    // Cập nhật thông tin người dùng
    async updateUser(req, res, next) {
        const { id } = req.params;  // Nhận ID người dùng từ tham số URL
        const { username, email, telephone, role } = req.body; // Lấy dữ liệu từ form sửa

        try {
            // Cập nhật thông tin người dùng trong MongoDB
            await User.findByIdAndUpdate(id, { username, email, telephone, role });

            // Chuyển hướng lại trang danh sách người dùng sau khi cập nhật
            res.redirect('/news');
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin người dùng:', error);
            return res.status(500).json({ message: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng.' });
        }
    }

}

module.exports = new NewController();
