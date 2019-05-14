import { Statement } from './ast';
export default function transform(body: Statement[], path: string, withTypes?: boolean, noServerImport?: boolean, noDecorator?: boolean): Statement[];
