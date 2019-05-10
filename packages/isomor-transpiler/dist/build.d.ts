import transform from './transform';
export default transform;
export interface Options {
    srcFolder: string;
    distAppFolder: string;
    serverFolder: string;
    withTypes: boolean;
    watchMode: boolean;
    noServerImport: boolean;
}
export declare function build(options: Options): Promise<void>;
export declare const watcherUpdate: (options: Options) => (file: string) => Promise<void>;
export declare function getOptions(): {
    srcFolder: string;
    distAppFolder: string;
    serverFolder: string;
    withTypes: boolean;
    watchMode: boolean;
    noServerImport: boolean;
};
