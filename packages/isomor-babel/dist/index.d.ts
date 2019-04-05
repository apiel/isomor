import { Visitor } from '@babel/core';
export default function (): {
    name: string;
    visitor: Visitor<{}>;
};
