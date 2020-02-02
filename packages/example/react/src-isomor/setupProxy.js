const proxy = require('http-proxy-middleware');

module.exports = function (app, server) {
    app.use(proxy('/isomor', { target: 'http://127.0.0.1:3005' }));
    app.use(proxy('/isomor-ws', { target: 'ws://127.0.0.1:3005', ws: true }));
};
