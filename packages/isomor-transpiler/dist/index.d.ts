export declare function magic<OUTPUT, INPUT>(action: () => (input: INPUT) => Promise<OUTPUT>, input: INPUT): Promise<OUTPUT>;
