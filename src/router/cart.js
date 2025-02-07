const express = require('express');
const router = express.Router();
const cartController = require('../app/controllers/CartControllers')
const {checkLogin2} = require("../router/auth")
router.get('/cart',checkLogin2, cartController.cart);
router.post('/cart',checkLogin2, cartController.addToCart);

// Route xóa người dùng
router.post('/cartDelete/:productId', checkLogin2, cartController.deleteCart);

module.exports = router;
