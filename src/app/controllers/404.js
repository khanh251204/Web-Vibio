const User = require('../models/User');
class M404Controller {
    async m404(req, res) {
        const us = req.session.userInfo;
        return res.render('UI/404', {User:us});
    }
}

module.exports = new M404Controller();
