import { FnOptions } from './transformNode';
import { Statement } from './ast';
export default function transform(body: Statement[], fnOptions: FnOptions, noServerImport?: boolean, noDecorator?: boolean): Statement[];
