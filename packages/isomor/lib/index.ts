/**
 * IMPORTANT: this file should never import node files,
 * even if it's just for types, some library like angular
 * dont like it!
 */
import { isomorRemoteHttp, setHttpClient } from './remoteHttp';
import { isomorRemoteWs } from './remoteWs';
export {
    subscribe,
    unsubscribe,
    SubscribeFn,
    WsServerAction,
    WsClientAction,
    WsConfig,
    wsDefaultConfig,
    setWsConfig,
    openWS,
} from './remoteWs';

const urlPrefix = '/isomor'; // http://127.0.0.1:3000/
let httpBaseUrl: string;
let wsBaseUrl: string;

export function getUrlPath(
    moduleName: string,
    funcName: string,
): string {
    return `${urlPrefix}/${moduleName}/${funcName}`;
}

export function setHttpBaseUrl(baseUrl?: string) {
    httpBaseUrl = baseUrl;
}

export function setWsBaseUrl(baseUrl?: string) {
    wsBaseUrl = baseUrl;
}

export function isomorRemote(
    protocol: string,
    baseUrl: string,
    moduleName: string,
    funcName: string,
    args: any[],
): Promise<any> {
    if (protocol === 'ws') {
        return isomorRemoteWs(wsBaseUrl || baseUrl, moduleName, funcName, args);
    }
    return isomorRemoteHttp(httpBaseUrl || baseUrl, moduleName, funcName, args);
}
