// otpModel.js

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();
let otpStore = {}; // Lưu OTP trong bộ nhớ (hoặc cơ sở dữ liệu trong thực tế)
// Cấu hihinhf SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // Thay đổi host cho đúng dịch vụ bạn sử dụng
    port: 587,                             // Hoặc 465 nếu sử dụng SSL
    secure: false,
    auth: {
      user: process.env.ENV_EMAIl, // Thay bằng email của bạn
      pass: process.env.ENV_PASSWORD,  // Thay bằng mật khẩu ứng dụng của bạn
    },
  });
 
// Hàm tạo OTP 6 chữ số
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Lưu OTP vào bộ nhớ
function storeOTP(email, otp) {
  otpStore[email] = otp;
}

// Kiểm tra OTP
function verifyOTP(email, otp) {
  if (otpStore[email] && otpStore[email] === otp) {
    delete otpStore[email]; // Xóa OTP sau khi đã xác thực
    return true;
  }
  return false;
}


module.exports = {
    transporter,
  generateOTP,
  storeOTP,
  verifyOTP
};
