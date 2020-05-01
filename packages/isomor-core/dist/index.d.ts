import { Extensions } from './config';
export { getOptions, Options } from './config';
export interface ValidationSchema {
    args: string[];
    schema: any;
    name: string;
}
export declare function getJsonSchemaFileName(name: string): string;
export declare function getFiles(folder: string, extensions: Extensions): Promise<string[]>;
