import { Options } from 'isomor-core';
export declare function generateServer(options: Options): Promise<void>;
export declare function generateServerWithBabel({ serverFolder, srcFolder, }: Options): Promise<unknown>;
export declare function generateServerWithTsc({ serverFolder, srcFolder, watchMode, }: Options): Promise<void>;
