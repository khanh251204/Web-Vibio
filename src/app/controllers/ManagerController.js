// app/controllers/ManagerController.js
const User = require('../models/User');
class ManagerController {
    async manager(req, res) {
        const us = req.session.userInfo;
        return res.render('UI/manager',{User:us})
    }
}

module.exports = new ManagerController();
