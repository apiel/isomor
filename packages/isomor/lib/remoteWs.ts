import { getUrlPath } from '.';

export type SubscribFn = (payload: any) => void;

let ws: WebSocket;
let reqId = 0;
const reqQueue = {};
let subId = 0;
const subscribedFunctions: { [key: number]: SubscribFn } = {};
let wsReady = false;

function openWS(baseUrl: string) {
    // ws = new WebSocket(`ws://${location.host}/isomor-ws`);
    // ws = new WebSocket(`ws://127.0.0.1:3005`);
    ws = new WebSocket(baseUrl);
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
    // ToDo create a type definition for each action
    ws.onmessage = (msgEv) => {
        // console.log('WS msg', msgEv);
        const data = JSON.parse(msgEv.data);
        if (data.action === 'API_RES') {
            reqQueue[data.id]?.resolve(data.result);
            delete (reqQueue[data.id]);
        } else if (data.action === 'API_ERR') {
            reqQueue[data.id]?.reject(data.error);
            delete (reqQueue[data.id]);
        } else if (data.action === 'PUSH') {
            Object.values(subscribedFunctions).forEach(fn => fn(data.payload));
        }
    };
}

function waitForWs(baseUrl: string) {
    if (!ws) {
        openWS(baseUrl);
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

export async function isomorRemoteWs(
    baseUrl: string,
    path: string,
    pkgname: string,
    funcName: string,
    args: [],
    classname?: string,
): Promise<any> {
    await waitForWs(baseUrl);
    const id = reqId++;
    return new Promise((resolve, reject) => {
        reqQueue[id] = { id, resolve, reject };
        setTimeout(() => reject('request timeout'), 10000);
        ws.send(JSON.stringify({
            action: 'API',
            id,
            path: getUrlPath(path, pkgname, funcName, classname),
            args,
        }));
    });
}

export function subscrib(fn: SubscribFn) {
    const key = subId++;
    subscribedFunctions[key] = fn;

    return key;
}

export function unsubscrib(key: number) {
    delete subscribedFunctions[key];
}
