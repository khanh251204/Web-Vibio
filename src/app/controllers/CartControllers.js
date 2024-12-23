const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User = require('../models/User');

class cartControllers{
    async cart(req, res) {
        if (!req.session.userId) {
            return res.redirect('/login');  // Nếu người dùng chưa đăng nhập, chuyển hướng tới trang đăng nhập
        }
    
        try {
            // Lấy thông tin người dùng từ session
            const us = req.session.userInfo;
    
            // Tìm giỏ hàng của người dùng từ cơ sở dữ liệu
            let cart = await Cart.findOne({ userId: req.session.userId }).populate('items.productId');
    
            // Nếu không có giỏ hàng, tạo giỏ hàng mới
            if (!cart) {
                cart = new Cart({
                    userId: req.session.userId,
                    items: [],  // Giỏ hàng trống nếu chưa có sản phẩm
                });
                await cart.save();  // Lưu giỏ hàng mới vào cơ sở dữ liệu
            }
    
            // Render giỏ hàng với các sản phẩm và thông tin người dùng
            res.render('UI_User/cart', { cart, User:us });
    
        } catch (error) {
            console.error(error);
            res.status(500).send('Có lỗi xảy ra khi lấy giỏ hàng');
        }
    }
    async addToCart(req, res, next) {
        try {
            const { productId, quantity } = req.body;
            const userId = req.session.userId; // Lấy ID người dùng từ session (hoặc từ token)

            if (!productId || !quantity) {
                return res.status(400).json({ message: 'Thiếu dữ liệu bắt buộc' });
            }

            // Kiểm tra xem sản phẩm có tồn tại không
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
            }

            // Kiểm tra xem giỏ hàng của người dùng có tồn tại không
            let cart = await Cart.findOne({ userId });
            if (!cart) {
                // Nếu không có giỏ hàng, tạo mới
                cart = new Cart({ userId, items: [] });
            }

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const existingItem = cart.items.find(item => item.productId.toString() === productId);
            if (existingItem) {
                // Nếu có rồi, cập nhật số lượng
                existingItem.quantity += parseInt(quantity);
            } else {
                // Nếu chưa có, thêm sản phẩm mới vào giỏ hàng
                cart.items.push({ productId, quantity: parseInt(quantity) });
            }

            // Lưu giỏ hàng vào MongoDB
            await cart.save();

            // Cập nhật lại cartId của người dùng
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Người dùng không tồn tại' });
            }

            user.cartId = cart._id;  // Cập nhật cartId cho người dùng
            await user.save();  // Lưu lại thông tin người dùng

            // Trả về giỏ hàng đã cập nhật dưới dạng JSON hoặc render lại trang giỏ hàng
            res.redirect('/cart');
            // res.status(200).json({ message: 'Sản phẩm đã được thêm vào giỏ hàng', cart });
        } catch (err) {
            console.error('Lỗi khi thêm vào giỏ hàng:', err);
            res.status(500).json({ message: 'Lỗi khi thêm sản phẩm vào giỏ hàng' });
        }
    }
}
module.exports = new cartControllers();
