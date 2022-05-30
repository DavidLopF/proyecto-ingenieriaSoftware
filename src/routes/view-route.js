const { Router } = require('express')
const router = Router()
const { validateAuth} = require('../helpers/jwt')
const ViewController = require('../controllers/view-controller')
const viewController = new ViewController();

router.get('/register', (req, res) => {
    res.render('auth/register')
})

router.get('/registerAdmin', (req, res) => {
    res.render('auth/registerAdmin')
})

router.get('/home', (req, res) => {
    viewController.gethome(req, res)
})

router.get('/home2', (req, res) => {
    viewController.gethomeAdmin(req, res)
})

router.get('/team/create', (req, res) => {
    viewController.getcreateTeam(req, res)
})


module.exports = router