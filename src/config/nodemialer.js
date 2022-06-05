const nodemialer = require('nodemailer');
const colors = require('colors');
const hbs = require('express-handlebars');
const path = require('path');


class Mailer {
    constructor() {
        const config = {
            host: process.env.SMTP_SERVER,
            port: 465,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        }
        this.transporter = nodemialer.createTransport(config);
        this.transporter.use('hbs', hbs.engine({
            extname: 'hbs',
            defaultLayout: 'default',
            layoutsDir: path.join(__dirname, '../views/layouts'),
            partialsDir: path.join(__dirname, '../views/partials')
        }));

    }

    sendMail(user, mail) {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user,
            subject: mail.subject,
            html: mail.html
        }
        const flag = this.transporter.sendMail(mailOptions)
        if (flag) {
            console.log(colors.green('Mail sent to ' + user)); return true;
        } else {
            console.log(colors.red('Mail not sent'));
            return false;
        }
    }
}

module.exports = new Mailer();