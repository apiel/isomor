import { Statement } from './ast';
export default function transform(body: Statement[], srcFilePath: string, path: string, pkgName?: string, withTypes?: boolean, noServerImport?: boolean, noDecorator?: boolean): Statement[];
