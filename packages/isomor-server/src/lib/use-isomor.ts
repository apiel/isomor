import * as express from 'express';
import { getFiles, getPkgName } from 'isomor-core';
import { isFunction } from 'util';
import { Entrypoint, getFunctions, getClassEntrypoints, getEntrypoint } from './entrypoint';

export async function useIsomor(
    app: express.Express,
    distServerFolder: string,
    serverFolder: string,
    jsonSchemaFolder: string,
    noDecorator: boolean = false,
): Promise<Entrypoint[]> {
    const pkgName = getPkgName(distServerFolder);
    const files = await getFiles(distServerFolder, serverFolder);
    return (files.map(file => {
        const functions = getFunctions(distServerFolder, file);
        return (Object.keys(functions)
            .filter(name => isFunction(functions[name]))
            .map(name => {
                const isClass = /^\s*class/.test(functions[name].toString());
                return isClass ? getClassEntrypoints(app, file, pkgName, name, jsonSchemaFolder, noDecorator)
                    : [getEntrypoint(app, file, pkgName, functions[name], name, jsonSchemaFolder)];
            }) as any).flat();
    }) as any).flat();
}
