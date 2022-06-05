const { validationResult } = require('express-validator');
const validateData = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('error', {
            message:  'Campos vacios, valide nuevamente',
        });
    }

    next();
}

module.exports = {
    validateData
}