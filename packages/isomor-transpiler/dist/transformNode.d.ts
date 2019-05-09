import { Statement } from './ast';
export declare function transformNode(node: Statement, path: string, withTypes: boolean, noServerImport: boolean): void | import("@babel/types").BlockStatement | import("@babel/types").DoWhileStatement | import("@babel/types").ForInStatement | import("@babel/types").ForStatement | import("@babel/types").FunctionDeclaration | import("@babel/types").SwitchStatement | import("@babel/types").WhileStatement | import("@babel/types").ForOfStatement | import("@babel/types").BreakStatement | import("@babel/types").ClassDeclaration | import("@babel/types").ContinueStatement | import("@babel/types").ReturnStatement | import("@babel/types").ThrowStatement | import("@babel/types").IfStatement | import("@babel/types").DebuggerStatement | import("@babel/types").VariableDeclaration | import("@babel/types").ExportAllDeclaration | import("@babel/types").ExportDefaultDeclaration | import("@babel/types").ExportNamedDeclaration | import("@babel/types").ImportDeclaration | import("@babel/types").DeclareClass | import("@babel/types").DeclareFunction | import("@babel/types").DeclareInterface | import("@babel/types").DeclareModule | import("@babel/types").DeclareModuleExports | import("@babel/types").DeclareTypeAlias | import("@babel/types").DeclareOpaqueType | import("@babel/types").DeclareVariable | import("@babel/types").DeclareExportDeclaration | import("@babel/types").DeclareExportAllDeclaration | import("@babel/types").InterfaceDeclaration | import("@babel/types").OpaqueType | import("@babel/types").TypeAlias | import("@babel/types").TSDeclareFunction | import("@babel/types").TSInterfaceDeclaration | import("@babel/types").TSTypeAliasDeclaration | import("@babel/types").TSEnumDeclaration | import("@babel/types").TSModuleDeclaration | import("@babel/types").EmptyStatement | import("@babel/types").ExpressionStatement | import("@babel/types").LabeledStatement | import("@babel/types").TryStatement | import("@babel/types").WithStatement | import("@babel/types").TSImportEqualsDeclaration | import("@babel/types").TSExportAssignment | import("@babel/types").TSNamespaceExportDeclaration | Statement[];
