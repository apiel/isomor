import { Statement } from './ast';
export declare function getCodeType(name: string): Statement;
export declare function getCodeImport(): Statement;
export declare function getCodeFunc(fileName: string, name: string, withTypes: boolean): Statement;
export declare function getCodeArrowFunc(fileName: string, name: string, withTypes: boolean): Statement;
export declare function getCodeMethod(fileName: string, name: string, className: string, withTypes: boolean): {
    type: string;
    static: boolean;
    key: {
        type: string;
        name: string;
    };
    async: boolean;
    params: ({
        typeAnnotation: {
            type: string;
            typeAnnotation: {
                type: string;
            };
        };
        type: string;
        argument: {
            type: string;
            name: string;
        };
    } | {
        typeAnnotation?: undefined;
        type: string;
        argument: {
            type: string;
            name: string;
        };
    })[];
    body: {
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
};
