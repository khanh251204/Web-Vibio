const mongoose = require('mongoose');

// Định nghĩa schema cho người dùng
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Bắt buộc
  },
  img: {
    type: String,
    required: true, // Bắt buộc
  },
  style: {
    type: String,
    required: true, // Bắt buộc
  },
 
  price: {
    type: Number,
    required: true, // Bắt buộc
  },
  salePrice: {
    type: Number,
    default:null,
  },
  delete: {
    type: Boolean,
    default: false // Gán mặc định là 'user' nếu không có giá trị
  },
}, {
  timestamps: true // Tự động thêm các trường createdAt và updatedAt
});


// Xuất model
module.exports = mongoose.model('Product', userSchema);
