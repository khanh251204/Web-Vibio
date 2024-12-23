const mongoose = require('mongoose');

// Định nghĩa schema cho người dùng
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // Bắt buộc
    unique: true,   // Đảm bảo tên người dùng là duy nhất
    trim: true      // Xóa khoảng trắng thừa
  },
  password: {
    type: String,
    required: true, // Bắt buộc
  },
  email: {
    type: String,
    required: true, // Bắt buộc
    unique: true,   // Đảm bảo email là duy nhất
    lowercase: true, // Chuyển đổi email về chữ thường
    trim: true      // Xóa khoảng trắng thừa
  },
  telephone: {
    type: Number,
    required: true, // Bắt buộc
  },
  role: {
    type: String,
    default: 'user' // Gán mặc định là 'user' nếu không có giá trị
  },
  delete: {
    type: Boolean,
    default: 'false' // Gán mặc định là 'user' nếu không có giá trị
  },
}, {
  timestamps: true // Tự động thêm các trường createdAt và updatedAt
});

// Xuất model
module.exports = mongoose.model('User', userSchema);
