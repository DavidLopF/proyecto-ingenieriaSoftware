const { Router } = require('express')
const router = Router()
const { validateAuth} = require('../helpers/jwt')
const ViewController = require('../controllers/view-controller')
const viewController = new ViewController();

router.get('/register', (req, res) => {
    res.render('auth/register')
})

router.get('/home', (req, res) => {
    viewController.gethome(req, res)
})

router.get("/team" , (req, res) => {
    viewController.getViewTeam(req, res)
})

router.get('/team/create', (req, res) => {
    viewController.getcreateTeam(req, res)
})

router.get('/team/add_competitor', (req, res) => {
    viewController.getAddCompetitor(req, res)
})
module.exports = router