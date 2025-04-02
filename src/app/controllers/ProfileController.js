// app/controllers/ManagerController.js
const User = require('../models/User');
class ProfileController {
    async profile(req, res) {
        const us = req.session.userInfo;
        const userId = req.session.userId;
        return res.render('UI/profile',{User:us, userId:userId});
    }
}
module.exports = new ProfileController();

