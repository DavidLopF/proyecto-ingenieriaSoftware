const { Router } = require('express');
const router = Router();
const Auth = require('../controllers/auth-controller');
const auth = new Auth();
const { validateData } = require('../middlewares/validate-data');
const { check } = require('express-validator');
const passport = require('passport');
const { validateAuth } = require('../helpers/jwt');


router.post('/register', [
    check('first_name').not().isEmpty().withMessage('First name is required'),
    check('last_name').not().isEmpty().withMessage('Last name is required'),
    check('age').not().isEmpty().withMessage('Age is required'),
    check('age').isInt({ min: 0 }).withMessage('Age must be a number'),
    check('dni').not().isEmpty().withMessage('DNI is required'),
    check('email').not().isEmpty().withMessage('Email is required'),
    check('email').isEmail().withMessage('Email is invalid'),
    check('password').not().isEmpty().withMessage('Password is required'),
    validateData
]
    , (req, res) => {
        auth.register(req, res);
    })

router.post('/login', [
    check('email').not().isEmpty().withMessage('Email is required'),
    check('email').isEmail().withMessage('Email is invalid'),
    check('password').not().isEmpty().withMessage('Password is required'),
    validateData
], (req, res) => {
    auth.login(req, res);
})


router.post('/send', [
    validateAuth
], async (req, res) => {
    auth.sendEmail(req, res);
})

module.exports = router;