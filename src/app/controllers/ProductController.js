const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User = require('../models/User');

class ProductController {
    // Render trang sản phẩm
    product(req, res) {
        const us = req.session.userInfo;
        res.render('UI/product',{User:us});
    }

    // Hiển thị giỏ hàng của người dùng
    
    

    // Hiển thị trang chủ với danh sách sản phẩm
    async printProduct(req, res) {
        try {
            // Truy vấn tất cả sản phẩm trong cơ sở dữ liệu
            const products = await Product.find({ delete: false });  // Lọc những sản phẩm chưa bị xóa (delete: false)
            const user = await req.session.userInfo;
            // Render trang home với dữ liệu sản phẩm
            res.render('UI_User/home', { products, User:user });
        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm:', error);
            res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm' });
        }
    }

    // Thêm sản phẩm mới vào cơ sở dữ liệu
    async addProduct(req, res) {
        const { name, img, style, price, salePrice } = req.body;
        
        if (!name || !img || !style || !price) {
            return res.status(400).json({ message: 'Thiếu dữ liệu bắt buộc' });
        }

        try {
            // Tạo đối tượng mới từ model Product
            const newProduct = new Product({
                name,
                img,
                style,
                price,
                salePrice: salePrice || null,  // Nếu không có giá giảm, sử dụng giá gốc
                delete: false,  // Sản phẩm chưa bị xóa
            });

            // Lưu sản phẩm mới vào cơ sở dữ liệu
            await newProduct.save();

            // Redirect về trang sản phẩm hoặc thông báo thành công
            res.redirect('/product');  // Đảm bảo chuyển hướng đúng sau khi thêm sản phẩm thành công
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            res.status(500).json({ message: 'Lỗi khi thêm sản phẩm' });
        }
    }

    // Thêm sản phẩm vào giỏ hàng
    

}

module.exports = new ProductController();
