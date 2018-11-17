const http = require('http');
const conf = require('./config/defaultConfig');
const chalk = require('chalk');
const path = require('path');
const route = require('./helper/route');

class Server {
    constructor (config) {
        this.conf = Object.assign({},conf,config);
    }
    start() {
        const server = http.createServer((req,res) => {
            const filepath = path.join(conf.root,req.url);
            route(req,res,filepath);
        });

        server.listen(conf.port,conf.hostname,() => {
            const addr = `http://${conf.hostname}:${conf.port}`;
            console.info(`Server start at  ${chalk.green(addr)}`);
        });
    }
}


