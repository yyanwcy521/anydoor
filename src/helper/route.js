const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const config = require('../config/defaultConfig');
const mime = require('./mime');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./cache');

const tplPath = path.join(__dirname,'../template/dir.tpl');
const source = fs.readFileSync(tplPath,'utf-8');
const template = Handlebars.compile(source);


module.exports = async function (req,res,filepath) {
    try {
        const stats = await stat(filepath);
        if (stats.isFile()) {
            const contentType = mime(filepath);
            res.setHeader('Content-Type',contentType);

            if (isFresh(stats,req,res)) {
                res.statusCode = 304;
                res.end();
                return;
            }

            let rs;
            const {code,start,end} = range(stats.size,req,res);
            if (code === 200) {
                res.statusCode = 200;
                rs = fs.createReadStream(filepath);
            } else {
                res.statusCode = 206;
                rs = fs.createReadStream(filepath,{start,end});
            }
            if (filepath.match(config.compress)) {
                rs = compress(rs,req,res);
            }
            rs.pipe(res);
        }
        if (stats.isDirectory()) {
            const files = await readdir(filepath);
            res.statusCode = 200;
            res.setHeader('Content-Type','text/html');
            const dir = path.relative(config.root,filepath);
            const data = {
                title:path.basename(filepath),
                dir:dir ? `/${dir}` : '',
                files
            };
            res.end(template(data));
        }
    } catch(e) {
        console.error(e);
        res.statusCode = 400;
        res.setHeader('Content-Type','text/plain');
        res.end(`${e}`);
    }
};