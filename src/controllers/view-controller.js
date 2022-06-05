const { verifyJWT, getJWT } = require('../helpers/jwt')

class viewController {

    gethome(req, res) {
        res.render('user/home')
    }
    getViewTeam(req, res) {
       res.render('team/panel')
    }
    getcreateTeam(req, res) {
        res.render('team/create')
    }
    getAddCompetitor(req, res) {
        res.render('team/add_competitor')
    }
    getDeleteTeam(req, res) {
        res.render('team/delete_competitor')
    }
}


module.exports = new viewController()