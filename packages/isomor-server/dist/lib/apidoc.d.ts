import { Entrypoint } from '.';
export declare function getApiDoc(endpoints: Entrypoint[]): {
    swagger: string;
    info: {
        title: string;
        version: string;
    };
    paths: {};
    definitions: {};
    consumes: string[];
};
