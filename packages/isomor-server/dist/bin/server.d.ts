#!/usr/bin/env node
interface Options {
    distServerFolder: string;
    serverFolder: string;
    jsonSchemaFolder: string;
    port: number;
    staticFolder: string | null;
    startupFile: string;
    noDecorator: boolean;
}
export declare function getOptions(): Options;
export {};
