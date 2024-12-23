const express = require('express');
const router = express.Router();
const productController = require('../app/controllers/ProductController');
const { checkLogin2 } = require('./auth');


router.get('/product',checkLogin2,productController.product);
// router.get('/cart',checkLogin2,productController.cart);
// router.post('/cart',checkLogin2,productController.addToCart);
router.get('/home',checkLogin2,productController.printProduct);
router.post('/addProduct',checkLogin2, productController.addProduct);

module.exports = router;
