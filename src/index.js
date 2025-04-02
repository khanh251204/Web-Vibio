const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const {engine} = require('express-handlebars');
const handlebars = require('handlebars')
const morgan = require('morgan');
const path = require('path'); 
const app = express();
const port = 8000;
require('dotenv').config();
const otpModel = require('./app/models/otp');


// Router 
const Router = require("./router/app")
// Morgan
app.use(morgan("combined"))



// Duong dan path
app.set('views',path.join(__dirname,'resources/views'))


handlebars.registerHelper('eq', function(a, b) {
    return a === b;
});
handlebars.registerHelper('multiply', function(a, b) {
    return a * b;
});

// Helper để định dạng ngày giờ
handlebars.registerHelper('formatDate', function(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()); // Lấy 2 chữ số cuối của năm
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
});
handlebars.registerHelper('formatDateBir', function(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()); // Lấy 2 chữ số cuối của năm
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year}`;
});
// Handlebars
app.engine('hbs',engine({
    // Rut ngan file
    extname:'.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,  // Cho phép truy cập vào các thuộc tính kế thừa
        allowProtoMethodsByDefault: true      // Cho phép truy cập vào các phương thức kế thừa
    },
    defaultLayout: 'main', // Tên của layout chính (nếu có)
}));
app.set('view engine','hbs')




// File static
app.use(express.static(path.join(__dirname,'public')));


// Middleware để parse body từ form
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // Sử dụng middleware tích hợp


// Cấu hình express-session
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: {
         secure: false,
         maxAge: 60000*25,
         saveUninitialized: true,
         cookie: { secure: false }  
    } 
}));

mongoose.connect(process.env.MGDB, {
    ssl: true
  }).then(() => {
    console.log('MongoDB connected successfully');
}).catch(err => {
    console.error('MongoDB connection failed:', err.message);
});
otpModel.transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log('Kết nối thành công');
    }
});
Router(app);


app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
})