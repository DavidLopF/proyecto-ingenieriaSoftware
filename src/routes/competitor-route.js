const Router = require('express');
const router = Router();
const competitorController = require('../controllers/competitor-controller');
const { validateAuth } = require('../helpers/jwt');

router.get('/haveTeam/:id', (req, res) => {
    competitorController.haveTeam(req, res);
});

router.get('/without_team', [
    validateAuth
], (req, res) => {
    competitorController.competitors_without_team(req, res);
});

module.exports = router;