
export interface GetListInput {
    foo: string;
}

export type Hello = [number, string, boolean, number, GetListInput];

export function fun(a: string, b: GetListInput, c?: number, d?: any, ...yo: string[]) {

}
