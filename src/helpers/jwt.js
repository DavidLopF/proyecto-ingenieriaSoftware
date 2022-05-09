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


const verifyJWT = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.TOKET_KEY, (err, decoded) => {
            if (err) {
                console.log(err);
                reject('error verifying token');
            } else {
                resolve(decoded);
            }
        })
    })
}


module.exports = {
    generateJSW,
    verifyJWT
};