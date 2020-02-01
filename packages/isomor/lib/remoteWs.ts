import { getUrl } from '.';

let ws: WebSocket;
const reqQueue = {};
let wsReady = false;
function openWS() {
    ws = new WebSocket(`ws://${location.host}/isomor`);
    // ws = new WebSocket(`ws://127.0.0.1:3005/isomor`);
    ws.onopen = () => {
        // console.log('WS connection established');
        wsReady = true;
    };
    ws.onclose = () => {
        // console.log('WS connection closed');
        wsReady = false;
        ws = null;
        // we could try to re-connect?
    };
    ws.onmessage = (msgEv) => {
        // console.log('WS msg', msgEv);
        const data = JSON.parse(msgEv.data);
        if (data.action === 'API_RES') {
            reqQueue[data.id]?.resolve(data.result);
        } else if (data.action === 'API_ERR') {
            reqQueue[data.id]?.reject(data.error);
        }
    };
}

function waitForWs() {
    if (!ws) {
        openWS();
    }
    return new Promise((resolve, reject) => {
        checkWs(resolve);
    });
}

function checkWs(resolve: (value?: unknown) => void) {
    if (wsReady) {
        resolve();
    }
    setTimeout(() => checkWs(resolve), 100);
}

let reqId = 0;
export async function isomorRemoteWs(
    path: string,
    pkgname: string,
    funcName: string,
    args: [],
    classname?: string,
): Promise<any> {
    await waitForWs();
    const id = reqId++;
    return new Promise((resolve, reject) => {
        reqQueue[id] = { id, resolve, reject };
        setTimeout(() => reject('request timeout'), 10000);
        ws.send(JSON.stringify({
            action: 'API',
            id,
            path: getUrl(path, pkgname, funcName, classname),
            args,
        }));
    });
}
