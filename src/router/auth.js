
function checkLogin(req, res, next) {
    // Kiểm tra nếu người dùng đã đăng nhập
    if (req.session.loggedIn) {
        // Nếu người dùng đã đăng nhập và cố gắng truy cập trang login hoặc register,
        // chuyển hướng đến trang manager
        if (req.originalUrl === '/login' || req.originalUrl === '/register') {
            return res.redirect('/manager');
        }
        // Nếu đã đăng nhập và cố gắng truy cập các route bảo vệ (như /manager), tiếp tục
        return next();
    }

    // Nếu người dùng chưa đăng nhập và cố gắng truy cập các route bảo vệ, chuyển hướng đến trang login
    if (req.originalUrl === '/manager') {
        return res.redirect('/login'); // Chuyển hướng đến login nếu chưa đăng nhập
    }

    // Nếu chưa đăng nhập, cho phép tiếp tục với các route như login và register
    next();
}
// middlewares/auth.js
 async function checkLogin2(req, res, next) {
    if (!req.session.loggedIn) {
        return res.redirect('/'); // Nếu chưa đăng nhập, chuyển hướng đến trang login
    }
    next(); // Nếu đã đăng nhập, tiếp tục xử lý request
}
async function checkAdmin (req, res, next){
    if(req.session.userInfo.role && req.session.userInfo.role === 'admin'){
        return next();
    }
    return res.redirect('/product');
}

module.exports = { checkLogin,checkLogin2, checkAdmin};





