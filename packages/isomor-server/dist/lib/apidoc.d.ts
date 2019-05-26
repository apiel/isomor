import { Entrypoint } from '.';
export declare function getApiDoc(endpoints: Entrypoint[]): Promise<{
    swagger: string;
    info: {
        title: string;
        version: string;
    };
    paths: {};
    definitions: {
        Args: {
            type: string;
            required: string[];
            properties: {
                args: {
                    type: string;
                    example: any[];
                };
            };
        };
    };
    consumes: string[];
}>;
