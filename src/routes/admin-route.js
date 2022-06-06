const { Router } = require('express')
const router = Router()
const Admin = require('../controllers/admin-controller')
const admin = new Admin();

router.get('/teams', (req, res) => {
    admin.getTems(req, res);
})

router.post('/deleteTeam/:team_id', (req, res) => {
    admin.deleteTeam(req, res);
});

router.get('/csv', (req, res) => {
    admin.getCSV(req, res);
});

module.exports = router