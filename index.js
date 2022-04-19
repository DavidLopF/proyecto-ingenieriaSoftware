require('dotenv').config();

const Server = require('./src/controllers/server');

const server = new Server();

server.laucher();