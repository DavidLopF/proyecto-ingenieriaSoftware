const db = require('../models');
const { generateJSW } = require('../helpers/jwt');
const bcrypt = require('bcrypt');


class AuthController {

    register(req, res) {
        const { first_name, last_name, age, dni, email, type, password } = req.body;
        const salt = bcrypt.genSaltSync(10);
        console.log('->' , Number(type));
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
            where: {
                [db.Sequelize.Op.or]: [{ email }, { dni }]
            }
        }).then(user => {
            if (user) {
                return res.render('user/home', {
                    message: 'El usuario ya existe'
                }); 
            } else {
                db.User.create(userCreate).then(user => {
                    if (Number(type) === 1) {
                        db.Admin.create({
                            user_id: user.id
                        }).then(async admin => {
                            const token = await generateJSW(user, "admin");
                            return res.render('admin/home', {
                                user: user.dataValues,
                                token: token
                            });
                        });
                    } else if (Number(type) === 2 || !type) {
                        db.Competitor.create({
                            user_id: user.id
                        }).then(async competitor => {
                            const token = await generateJSW(user, "competitor");
                            return res.render('user/home', {
                                user: user.dataValues,
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
                return res.render('user/home', {
                    message: 'No se ha encontrado el usuario'
                });
            } else {
                if (bcrypt.compareSync(password, user.password)) {
                    //encontrar el tipo del usuario 
                    const admin = await db.Admin.findOne({
                        where: {
                            user_id: user.id
                        }
                    });
                    const competitor = await db.Competitor.findOne({
                        where: {
                            user_id: user.id
                        }
                    });
                    if (admin) {
                        const token = await generateJSW(user, "admin");
                        const us = user.dataValues
                        delete us.password
                        us.type = "admin"
                        return res.render('admin/home', {
                            user: us,
                            token: token
                        });
                    } else if (competitor) {
                        const token = await generateJSW(user, "competitor");
                        const us = user.dataValues
                        delete us.password
                        us.type = "competitor"
                        return res.render('user/home', {
                            user: us,
                            token: token
                        });
                    }
                } else {
                    return res.render('user/home', {
                        message: 'Contraseña incorrecta'
                    });
                }
            }
        });
    }
}


module.exports = AuthController;
