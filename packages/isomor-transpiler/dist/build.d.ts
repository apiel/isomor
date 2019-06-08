import transform from './transform';
export default transform;
export interface Options {
    pkgName: string;
    srcFolder: string;
    distAppFolder: string;
    serverFolder: string;
    jsonSchemaFolder: string;
    noValidation: boolean;
    withTypes: boolean;
    watchMode: boolean;
    noServerImport: boolean;
    noDecorator: boolean;
}
export declare function getOptions(): Options;
export declare function build(options: Options): Promise<void>;
export declare const watcherUpdate: (options: Options) => (file: string) => Promise<void>;
