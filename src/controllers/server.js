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

        this.middlewares();
        this.routes();


    }

    middlewares() {
        this.app.use(cors());
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.set('views', path.join(__dirname, 'src/views'));
        this.app.engine('hbs', hbs.engine({
            extname: 'hbs',
            defaultLayout: 'default',
            layoutsDir: path.join(__dirname, 'src/views/layouts'),
            partialsDir: path.join(__dirname, 'src/views/partials')
        }));
        this.app.set('view engine', 'hbs');
        this.app.set('views', path.join(__dirname, 'src/views'));

    }


    routes() {

    }

    laucher() {
        if (process.env.create_database === 'true') {
            console.log('Creating database...'.yellow);
            db.sequelize.sync().then(() => {
                this.Server.listen(this.port, this.host, () => {
                    console.log(colors.bgWhite.blue(`Server running in ${this.host}:${this.port}`));
                });
            });
        } else {
            this.Server.listen(this.port, this.host, () => {
                console.log(colors.bgWhite.blue(`Server running in ${this.host}:${this.port}`));
            });
        }
    }
}

module.exports = Server;