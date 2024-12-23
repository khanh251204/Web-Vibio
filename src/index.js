const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyparser = require('body-parser');
require('dotenv').config();


const app = express();
const port = 3050;

const {engine} = require('express-handlebars');
const morgan = require('morgan');
const path = require('path'); 
// const methodOverride = require('method-override'); 


// Router 
const Router = require("./router/app")
// Morgan
app.use(morgan("combined"))



// Duong dan path
app.set('views',path.join(__dirname,'resources/views'))



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
    secret: 'your-secret-key', // Thay bằng một chuỗi mật khẩu bí mật
    resave: false,
    saveUninitialized: true,
    cookie: {
         secure: false,
         httpOnly: true, 
         maxAge: 60000*3,
         saveUninitialized: true,
         cookie: { secure: false }  

    } // Cần cấu hình lại cho HTTPS nếu trên môi trường sản xuất
}));

mongoose.connect(process.env.MGDB).then(() => {
    console.log('MongoDB connected successfully');
})

.catch(err => {
    console.error('MongoDB connection failed:', err.message);
});

Router(app)

app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
})