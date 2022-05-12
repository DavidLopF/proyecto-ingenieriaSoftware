const { verifyJWT, getJWT } = require('../helpers/jwt')

class viewController {

    gethome(req, res) {
        res.render('user/home')
    }
}


module.exports = viewController