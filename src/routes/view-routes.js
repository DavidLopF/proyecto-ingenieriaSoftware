const { Router } = require('express')
const router = Router()



router.get('/register', (req, res) => {
    res.render('auth/register')
})


module.exports = router