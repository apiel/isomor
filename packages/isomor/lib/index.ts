/**
 * IMPORTANT: this file should never import node files,
 * even if it's just for types, some library like angular
 * dont like it!
 */
import { isomorRemoteHttp } from './remoteHttp';
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

export function getUrlPath(
    moduleName: string,
    funcName: string,
): string {
    return `${urlPrefix}/${moduleName}/${funcName}`;
}

export function isomorRemote(
    protocol: string,
    baseUrl: string,
    moduleName: string,
    funcName: string,
    args: any[],
): Promise<any> {
    if (protocol === 'ws') {
        return isomorRemoteWs(baseUrl, moduleName, funcName, args);
    }
    return isomorRemoteHttp(baseUrl, moduleName, funcName, args);
}
