const Router = require('express');
const router = Router();
const competitorController = require('../controllers/competitor-controller');

router.get('/haveTeam/:id', (req, res) => {
    competitorController.haveTeam(req, res);
});


module.exports = router;