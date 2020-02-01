const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/isomor',
        proxy({ target: 'http://127.0.0.1:3005', ws:true })
    );
};