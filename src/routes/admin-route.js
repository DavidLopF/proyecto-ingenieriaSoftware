const { Router } = require('express')
const router = Router()
const ViewController = require('../controllers/admin-controller')
const viewController = new ViewController();




module.exports = router