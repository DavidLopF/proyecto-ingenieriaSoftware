const Router = require('express')
const router = Router();
const teamController = require('../controllers/team-controller');
const { validateAuth } = require('../helpers/jwt');


router.route('/getbyuser')
    .get([validateAuth],
        async (req, res) => {
            teamController.getTeam(req, res);
        });
router.route('/create')
    .post([
        validateAuth,
    ],
        async (req, res) => {
            teamController.createTeam(req, res);
        });

router.route('/add_competitor')
    .post([
        validateAuth,
    ],
        async (req, res) => {
            teamController.addCompetitor(req, res);
        });

router.post('/delete_competitor', [
    validateAuth,
    ], async (req, res) => {
    teamController.deleteCompetitor(req, res);
});


module.exports = router;