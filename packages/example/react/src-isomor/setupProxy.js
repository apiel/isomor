const proxy = require('http-proxy-middleware');

const WebSocket = require('ws');

module.exports = function (app, server) {
    // console.log('server', server);
    // console.log('app', app);
    app.use(
        proxy('/isomor', {
            target: 'http://127.0.0.1:3005',
            // changeOrigin: true,
            onError: console.log,
            // ws: true,
            logLevel: 'debug',
        }),
    );
    // app.use(proxy('ws://127.0.0.1:3005'));
    // app.use(
    //     '/isomor-ws',
    //     proxy({ target: 'http://127.0.0.1:3005', ws: true })
    // );
    // app.use(
    //     '/isomor',
    //     proxy({ target: 'http://127.0.0.1:3005' })
    // );
    const wsProxy = proxy('/isomor-ws', {
        target: 'ws://127.0.0.1:3005',
        ws: true,
        // onProxyReqWs(proxyReq, req, socket, options, head) {
        //     // add custom header
        //     // console.log('onProxyReqWs', proxyReq);

        //     socket.onopen = () => {
        //         console.log('WS connection established');
        //     };
        //     socket.onclose = () => {
        //         console.log('WS connection closed');
        //     };
        //     socket.onmessage = (msgEv) => {
        //         console.log('WS msg', msgEv);
        //     };
        // },
        onError(err, req, res) {
            console.error('onError', err);
        }
    });
    app.use(wsProxy);

    app.use('/test', (req, res, next) => {
        const { server } = req.connection;
        server.on('upgrade', (req, socket, head) => {
            console.log('yoyoyoyoyohu upppp');
            // socket.on('message', (message) => {
            //     console.log('msg WS', message);
            // });
            openWS(server);
        });
        console.log('this.... blahhhahahaha');

        // openWS(server);


        next();
    });
    // server.on('upgrade', wsProxy.upgrade);
    // app.on('upgrade', () => { console.log('upppppp 1'); });
    // server.app.on('upgrade', () => { console.log('upppppp 2'); });
    // server.app.on('upgrade', wsProxy.upgrade);
    // console.log('server', server);
};

let wss;
function openWS(server) {
    if (!wss) {
        console.log('create websocket server');
        wss = new WebSocket.Server({ server });
        wss.on('connection', (ws, req) => {
            console.log('ccccococoocococnect WS');
            ws.on('message', (message) => {
                console.log('msg WS', message);
            });
        });
        wss.on('error', (error) => {
            console.log('error wss', error);
        });
        wss.on('close', () => {
            console.log('close wss');
        });
    }
}
