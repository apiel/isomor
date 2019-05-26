import * as express from 'express';
import { getFiles } from 'isomor-core';
import { isFunction } from 'util';
import { Entrypoint, getFunctions, getClassEntrypoints, getEntrypoint } from './entrypoint';

export async function useIsomor(
    app: express.Express,
    distServerFolder: string,
    serverFolder: string,
    noDecorator: boolean = false,
): Promise<Entrypoint[]> {
    const files = await getFiles(distServerFolder, serverFolder);
    return (files.map(file => {
        const functions = getFunctions(distServerFolder, file);
        return (Object.keys(functions)
            .filter(name => isFunction(functions[name]))
            .map(name => {
                const isClass = /^\s*class/.test(functions[name].toString());
                return isClass ? getClassEntrypoints(app, file, name, noDecorator)
                    : [getEntrypoint(app, file, functions[name], name)];
            }) as any).flat();
    }) as any).flat();
}
