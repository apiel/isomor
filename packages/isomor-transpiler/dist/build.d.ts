import { Options } from 'isomor-core';
import transform from './transform';
export default transform;
export declare function build(): Promise<void>;
export declare const watcherUpdate: (options: Options) => (file: string) => Promise<void>;
