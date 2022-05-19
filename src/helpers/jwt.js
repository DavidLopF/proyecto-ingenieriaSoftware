const jwt = require('jsonwebtoken');

const generateJSW = (user, type) => {
    return new Promise((resolve, reject) => {
        const payload = { user, type } //payload
        jwt.sign(payload, process.env.TOKET_KEY, (err, token) => {
            if (err) {
                console.log(err);
                reject('error generating token');
            } else {
                resolve(token);
            }
        })
    })
}


const validateAuth = (req, res, next) => {
    const token = getJWT(req, res)
    if (!token) {
        return res.render('user/home', {
            message: 'Error en la autenticación'
        })
    }
    jwt.verify(token, process.env.TOKET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'token invalid'
            })
        }
        req.user = decoded.user
        req.type = decoded.type
        next()
    })
}

const getJWT = (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        return token
    } catch (e) {
        console.log(e)
        return false
    }
}


module.exports = {
    generateJSW,
    validateAuth,
    getJWT
};