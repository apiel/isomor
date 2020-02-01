import { Route } from '.';
export declare function getApiDoc(endpoints: Route[]): {
    swagger: string;
    info: {
        title: string;
        version: string;
    };
    paths: {};
    definitions: {};
    consumes: string[];
};
