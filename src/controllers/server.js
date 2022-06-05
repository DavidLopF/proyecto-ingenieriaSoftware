const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const hbs = require('express-handlebars');
const path = require('path');
const colors = require('colors');
const db = require('../models/index');



class Server {
    constructor() {
        this.port = process.env.PORT || 3030;
        this.host = process.env.HOST || 'localhost';
        this.app = express();
        this.Server = require('http').Server(this.app);

        this.userPath = '/user';
        this.authPath = '/auth';
        this.viewPath = '/view';
        this.teamPath = '/team';
        this.adminPath = '/admin';
        this.competitor = '/competitor';
        this.middlewares();
        this.routes();


    }

    middlewares() {
        this.app.use(cors());
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        //poner para que se puedan ver los archivos en la carpeta public
        this.app.use(express.static(path.join(__dirname, '../public')));
        this.app.set('views', path.join(__dirname, 'src/views'));
        this.app.engine('hbs', hbs.engine({
            extname: 'hbs',
            defaultLayout: 'default',
            layoutsDir: path.join(__dirname, '../views/layouts'),
            partialsDir: path.join(__dirname, '../views/partials')
        }));
        this.app.set('view engine', 'hbs');
        this.app.set('views', path.join(__dirname, '../views'));
    }


    routes() {
        this.app.use(this.userPath, require('../routes/user-route'));
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.viewPath, require('../routes/view-route'));
        this.app.use(this.teamPath, require('../routes/team-route'));
        this.app.use(this.adminPath, require('../routes/admin-route'));
        this.app.use(this.competitor, require('../routes/competitor-route'));



        this.app.get('/', (req, res) => {
            res.render('auth/login');
        });

        this.app.use((req, res, next) => {
            res.status(404).send('404 Not Found');
        });
    }

    laucher() {
        if (process.env.CREATE_DATABASE === 'true') {
            console.log('Creating database...'.yellow);
            db.sequelize.sync().then(() => {
                this.Server.listen(this.port, this.host, () => {
                    console.log(colors.bgWhite.blue(`Server running in ${this.host}:${this.port}`));
                });
            });
        } else {
            this.Server.listen(this.port, this.host, () => {
                console.log(colors.bgWhite.blue(`Server running in http://${this.host}:${this.port}`));
            });
        }
    }
}

module.exports = Server;