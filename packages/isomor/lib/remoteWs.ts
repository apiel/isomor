import { getUrlPath } from '.';

export enum WsServerAction {
    PUSH = 'PUSH',
    CONF = 'CONF',
    API_RES = 'API_RES',
    API_ERR = 'API_ERR',
}

export enum WsClientAction {
    API = 'API',
}

export interface WsConfig {
    withCookie: boolean;
}

export type SubscribeFn = (payload: any) => void;

export const wsDefaultConfig: WsConfig = {
    withCookie: false,
}

let ws: WebSocket;
let reqId = 0;
const reqQueue = {};
let subId = 0;
const subscribedFunctions: { [key: number]: SubscribeFn } = {};
let wsReady = false;
let wsConfig: WsConfig = wsDefaultConfig;

export function setWsConfig(config: WsConfig) {
    wsConfig = config;
}

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
        if (data.action === WsServerAction.API_RES) {
            reqQueue[data.id]?.resolve(data.payload);
            delete (reqQueue[data.id]);
        } else if (data.action === WsServerAction.API_ERR) {
            reqQueue[data.id]?.reject(data.payload);
            delete (reqQueue[data.id]);
        } else if (data.action === WsServerAction.PUSH) {
            Object.values(subscribedFunctions).forEach(fn => fn && fn(data.payload));
        } else if (data.action === WsServerAction.CONF) {
            setWsConfig(data.payload);
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
            action: WsClientAction.API,
            id,
            path: getUrlPath(path, pkgname, funcName, classname),
            args,
            ...(wsConfig?.withCookie && { cookie: document?.cookie }),
        }));
    });
}

export function subscribe(fn: SubscribeFn) {
    const key = subId++;
    subscribedFunctions[key] = fn;

    return key;
}

export function unsubscribe(key: number) {
    delete subscribedFunctions[key];
}
