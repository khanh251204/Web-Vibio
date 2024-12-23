const express = require('express');
const router = express.Router();
const cartController = require('../app/controllers/CartControllers')
const {checkLogin2} = require("../router/auth")
router.get('/cart',checkLogin2, cartController.cart);
router.post('/cart',checkLogin2, cartController.addToCart);


module.exports = router;
