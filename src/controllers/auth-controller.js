const db = require('../models');
const { generateJSW } = require('../helpers/jwt');
const bcrypt = require('bcrypt');


class AuthController {

    register(req, res) {
        const { first_name, last_name, age, dni, email, type, password } = req.body;

        const salt = bcrypt.genSaltSync(10);
        const pass = bcrypt.hashSync(password, salt);
        const userCreate = {
            first_name,
            last_name,
            age,
            dni,
            email,
            password: pass,
        }

        db.User.findOne({
            //buscar en la base de datos donde el email o el dni coincidan con los que se envian
            where: {
                [db.Sequelize.Op.or]: [{ email }, { dni }]
            }
        }).then(user => {
            if (user) {
                return res.status(400).json({
                    message: 'User already exists'
                });
            } else {
                db.User.create(userCreate).then(user => {
                    if (type === 1) {
                        db.Admin.create({
                            user_id: user.id
                        }).then(async admin => {
                            const token = await generateJSW(user, "admin");
                            return res.status(201).json({
                                message: 'User created successfully',
                                token: token
                            });
                        });
                    } else if (type === 2 || !type) {
                        db.Competitor.create({
                            user_id: user.id
                        }).then(async competitor => {
                            const token = await generateJSW(user, "competitor");
                            return res.status(201).json({
                                message: 'User created successfully',
                                token: token
                            });
                        });
                    }
                });
            }
        });

    }


    login(req, res) {
        const { email, password } = req.body;
        db.User.findOne({
            where: {
                email: email
            }
        }).then(async user => {
            if (!user) {
                return res.status(400).json({
                    message: 'User not found'
                });
            } else {
                if (bcrypt.compareSync(password, user.password)) {
                    const token = await generateJSW(user, user.type);
                    return res.status(200).json({
                        message: 'User logged in successfully',
                        token: token
                    });
                } else {
                    return res.status(400).json({
                        message: 'Password incorrect'
                    });
                }
            }
        });

    }

}


module.exports = AuthController;
