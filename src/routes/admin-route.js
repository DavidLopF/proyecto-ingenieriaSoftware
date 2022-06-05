const { Router } = require('express')
const router = Router()
const Admin = require('../controllers/admin-controller')
const admin = new Admin();

router.get('/teams', (req, res) => {
    admin.getTems(req, res);
})


module.exports = router