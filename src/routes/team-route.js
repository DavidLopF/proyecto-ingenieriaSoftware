const Router = require('express')
const router = Router();
const TeamController = require('../controllers/team-controller');
const teamController = new TeamController();
const { validateAuth } = require('../helpers/jwt');


router.route('/getbyuser/:id')
    .get(async (req, res) => {
        teamController.getTeam(req, res);
    })



router.route('/create')
    .post([
        validateAuth,
    ],
        async (req, res) => {
        teamController.createTeam(req, res);
    })

module.exports = router;