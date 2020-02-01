/**
 * IMPORTANT: this file should never import node files,
 * even if it's just for types, some library like angular
 * dont like it!
 */

import axios from 'axios';
// import * as WebSocket from 'ws';

const urlPrefix = '/isomor'; // http://127.0.0.1:3000/

export function getUrl(
    path: string,
    pkgname: string,
    funcName: string,
    classname?: string,
): string {
    const url = classname
        ? `${urlPrefix}/${pkgname}/${path}/${classname}/${funcName}`
        : `${urlPrefix}/${pkgname}/${path}/${funcName}`;

    return url;
}

let ws: WebSocket;
const reqQueue = {};
let wsReady = false;
function openWS() {
    // ws = new WebSocket(`ws://${location.host}`);
    ws = new WebSocket(`ws://127.0.0.1:3005`);
    // ws = new WebSocket(location.origin);
    ws.onerror = () => {
        console.log('WS error');
    };
    ws.onopen = () => {
        console.log('WS connection established');
        wsReady = true;
    };
    ws.onclose = () => {
        console.log('WS connection closed');
        wsReady = false;
    };
    ws.onmessage = (msgEv) => {
        console.log('WS msg', msgEv);
        const data = JSON.parse(msgEv.data);
        if (data.action === 'API_RES') {
            reqQueue[data.id]?.resolve(data.result);
        } else if (data.action === 'API_ERR') {
            reqQueue[data.id]?.reject(data.error);
        }
    };
}
// if (typeof (window) !== undefined && typeof (location) !== undefined) {
//     openWS();
// }

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
export async function isomorRemote(
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

// export async function isomorRemote(
//     path: string,
//     pkgname: string,
//     funcName: string,
//     args: [],
//     classname?: string,
// ): Promise<any> {
//     const url = getUrl(path, pkgname, funcName, classname);
//     const { data: { result } } = await axios.request({
//         url,
//         ...(args.length
//             ? { method: 'POST', data: { args } }
//             : { method: 'GET' }),
//     });
//     return result;
// }

export type IsomorShare = any;

// @isomorShare
export function isomorShare(constructor: any) {
    //
}

// @isomor
const isomorDecorators: string[] = [];
export function isomor(constructor: any) {
    isomorDecorators.push(constructor.name);
}
export function isIsomorClass(name: string) {
    return isomorDecorators.includes(name);
}
