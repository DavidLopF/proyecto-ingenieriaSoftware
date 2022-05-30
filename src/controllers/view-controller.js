const { verifyJWT, getJWT } = require('../helpers/jwt')

class viewController {

    gethome(req, res) {
        res.render('user/home')
    }

    gethomeAdmin(req, res) {
        res.render('admin/home')
    }

    getcreateTeam(req, res) {
        res.render('team/create')
    }   
}


module.exports = viewController