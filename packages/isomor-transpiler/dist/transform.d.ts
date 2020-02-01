import { Statement } from './ast';
export default function transform(body: Statement[], srcFilePath: string, path: string, wsReg?: RegExp | null, pkgName?: string, withTypes?: boolean, noServerImport?: boolean, noDecorator?: boolean): Statement[];
