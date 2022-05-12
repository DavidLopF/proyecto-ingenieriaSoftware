const { Router } = require('express')
const router = Router()
const { verifyJWT } = require('../helpers/jwt')
const ViewController = require('../controllers/view-controller')
const viewController = new ViewController();

router.get('/register', (req, res) => {
    res.render('auth/register')
})

router.get('/home', (req, res) => {
    viewController.gethome(req, res)
})


module.exports = router