import { Statement } from './ast';
interface BodyRemote {
    moduleName: string;
    name: string;
    httpBaseUrl: string;
    wsBaseUrl: string;
    wsReg?: RegExp;
}
export interface CodeFunc {
    bodyParams: BodyRemote;
}
export declare function getCodeType(name: string): Statement;
export declare function getCodeImport(): Statement;
export declare function getCodeFunc({ bodyParams }: CodeFunc): Statement;
export declare function getCodeArrowFunc({ bodyParams }: CodeFunc): Statement;
export declare function getBody(bodyRemote: BodyRemote): {
    type: string;
    body: {
        type: string;
        argument: {
            type: string;
            callee: {
                type: string;
                name: string;
            };
            arguments: ({
                type: string;
                value: string;
                name?: undefined;
            } | {
                type: string;
                name: string;
                value?: undefined;
            })[];
        };
    }[];
};
export declare function getBodyEmptyReturn(): {
    type: string;
    body: {
        type: string;
        argument: {
            type: string;
            expression: {
                type: string;
                name: string;
            };
            typeAnnotation: {
                type: string;
            };
        };
    }[];
};
export {};
