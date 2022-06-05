const db = require('../models');
const { generateJSW } = require('../helpers/jwt');
const bcrypt = require('bcrypt');
const mail = require('../config/nodemialer');


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
            where: {
                [db.Sequelize.Op.or]: [{ email }, { dni }]
            }
        }).then(user => {
            if (user) {
                return res.render('error', {
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
                            user_id: user.id,
                            languaje: req.body.lenguaje
                        }).then(async competitor => {
                            user = user.dataValues
                            const token = await generateJSW(user, "competitor");
                            user.type = "competitor"
                            this.sendEmail(user.email, this.generateHtmlWelcome())
                            return res.render('user/home', {
                                user: user,
                                token: token,
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
                return res.render('error', {
                    message: 'No se ha encontrado el usuario'
                });
            } else {
                if (bcrypt.compareSync(password, user.password)) {
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
                    console.log('contraseña incorrecta')
                    return res.render('error', {
                        message: 'Contraseña incorrecta'
                    });
                }
            }
        });
    }

    async sendEmail(email, html_body) {
        const mail_options = {
            subject: '¡¡¡¡ Bienvenido al torneo de programacion !!!!!',
            html: html_body
        }
        const mailer = await mail.sendMail(email, mail_options);
    }
    generateHtmlWelcome() {
        return `
        <table style="width: 50%; border-collapse: collapse; border-style: hidden; margin-left: auto; margin-right: auto;" border="1">
        <tbody>
        <tr>
        <td style="width: 49.858%;"><strong><img style="display: block; margin-left: auto; margin-right: auto;" src="https://sibcolombia.net/wp-content/uploads/2016/06/logo-ubosque.png" alt="" width="200" height="200" /></strong></td>
        </tr>
        <tr>
        <td style="width: 49.858%;">
        <h1 style="text-align: center;"><strong>Bienvenido al torneo de programacion</strong></h1>
        </td>
        </tr>
        </tbody>
        </table>
        <table style="height: 128px; width: 50%; border-collapse: collapse; border-style: none; margin-left: auto; margin-right: auto;">
        <tbody>
        <tr style="height: 73px;">
        <td style="width: 100%; height: 73px;">
        <h4 style="text-align: center;"><strong>Ahora puedes crear un equipo o esperar que un capitan te agregue.</strong></h4>
        <p style="text-align: center;"><strong>Cuando esto pase podras visualizar la informacion de tu equipo en</strong></p>
        <p style="text-align: center;"><strong>la pagina del torneo.</strong></p>
        </td>
        </tr>
        <tr style="height: 55px;">
        <td style="width: 100%; height: 55px;"><hr /></td>
        </tr>
        </tbody>
        </table>
        `
    }
}


module.exports = AuthController;
