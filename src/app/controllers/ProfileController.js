// app/controllers/ManagerController.js
const User = require('../models/User');
class ProfileController {
    async profile(req, res) {
        const us = req.session.userInfo;
        return res.render('UI/profile',{User:us});
    }
}

module.exports = new ProfileController();
