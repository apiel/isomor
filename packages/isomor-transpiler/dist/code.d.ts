import { Statement } from './ast';
interface BodyRemote {
    path: string;
    pkgName: string;
    name: string;
    className?: string;
    httpBaseUrl: string;
    wsBaseUrl: string;
    wsReg?: RegExp;
}
export interface CodeFunc {
    withTypes: boolean;
    bodyParams: BodyRemote;
}
export declare function getCodeType(name: string): Statement;
export declare function getCodeImport(): Statement;
export declare function getCodeFunc({ bodyParams, withTypes }: CodeFunc): Statement;
export declare function getCodeArrowFunc({ bodyParams, withTypes }: CodeFunc): Statement;
export declare function getBody(bodyRemote: BodyRemote, params?: any): {
    type: string;
    body: ({
        type: string;
        declarations: {
            type: string;
            id: {
                type: string;
                name: string;
                typeAnnotation: {
                    type: string;
                    typeAnnotation: {
                        type: string;
                        elementType: {
                            type: string;
                        };
                    };
                };
            };
            init: {
                type: string;
                elements: any;
            };
        }[];
        kind: string;
    } | {
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
    })[];
};
export {};
