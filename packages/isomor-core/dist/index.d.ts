export { getOptions, Options } from './config';
export interface ValidationSchema {
    args: string[];
    schema: any;
    name: string;
}
export declare function getJsonSchemaFileName(path: string, name: string): string;
export declare function getFiles(folder: string, extensions: [string, ...string[]]): Promise<string[]>;
