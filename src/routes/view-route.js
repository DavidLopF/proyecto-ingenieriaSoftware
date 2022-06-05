const { Router } = require('express')
const router = Router()
const { validateAuth } = require('../helpers/jwt')
const viewController = require('../controllers/view-controller')


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

router.get("/team", (req, res) => {
    viewController.getViewTeam(req, res)

})

router.get('/team/create', (req, res) => {
    viewController.getcreateTeam(req, res)
})

router.get('/team/add_competitor', (req, res) => {
    viewController.getAddCompetitor(req, res)
})

router.get('/team/delete', (req, res) => {
    viewController.getDeleteTeam(req, res)
})


module.exports = router

