"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const traverse = require("traverse");
const code_1 = require("./code");
const ast_1 = require("./ast");
function transformInterface(root) {
    traverse(root).forEach(function (node) {
        if (node) {
            if ((node.type === 'TSTypeAnnotation' && node.typeAnnotation.type === 'TSTypeReference')
                || (node.type === 'TSTypeAnnotation'
                    && node.typeAnnotation.type === 'TSArrayType'
                    && node.typeAnnotation.elementType.type === 'TSTypeReference')) {
                node.typeAnnotation = {
                    type: 'TSAnyKeyword',
                };
                this.update(node);
            }
        }
    });
    return root;
}
exports.transformInterface = transformInterface;
function transformImport(root, noServerImport) {
    if (root.trailingComments && root.trailingComments[0].value.indexOf(' > ') === 0) {
        const code = root.trailingComments[0].value.substring(3);
        const { program: { body } } = ast_1.parse(code);
        return body;
    }
    if (noServerImport) {
        return;
    }
    if (root.source.type === 'StringLiteral') {
        if (root.source.value[0] === '.') {
            return null;
        }
    }
    return root;
}
exports.transformImport = transformImport;
function transformExport(root, noServerImport = false) {
    if (root.source.type === 'StringLiteral') {
        if (root.source.value[0] === '.' || noServerImport) {
            return root.specifiers.map(({ exported: { name } }) => code_1.getCodeType(name));
        }
    }
    return root;
}
exports.transformExport = transformExport;
function transformClass(root, path, withTypes) {
    if (root.declaration.type === 'ClassDeclaration') {
        if (root.declaration.implements) {
            const isIsomorShare = root.declaration.implements.filter((node) => node.type === 'TSExpressionWithTypeArguments'
                && node.expression.type === 'Identifier'
                && node.expression.name === 'IsomorShare').length > 0;
            if (isIsomorShare) {
                return root;
            }
        }
        const { name: className } = root.declaration.id;
        const { body } = root.declaration.body;
        body.forEach((node, index) => {
            if (node.type === 'ClassMethod') {
                const { name } = node.key;
                if (name === 'constructor') {
                    root.declaration.body.body[index] = code_1.getCodeConstructor(withTypes);
                }
                else {
                    root.declaration.body.body[index] = code_1.getCodeMethod(path, name, className, withTypes);
                }
            }
            else if (node.type !== 'ClassProperty') {
                delete root.declaration.body.body[index];
            }
        });
        return transformClassExportBeforeDecorator(root);
    }
    return;
}
exports.transformClass = transformClass;
function transformClassExportBeforeDecorator(root) {
    const suffix = '__deco_export__';
    const rootDeco = JSON.parse(JSON.stringify(root.declaration));
    rootDeco.id.name += suffix;
    rootDeco.body.body = [];
    root.declaration.decorators = [];
    root.declaration.superClass = {
        type: 'Identifier',
        name: rootDeco.id.name,
    };
    return [rootDeco, root];
}
exports.transformClassExportBeforeDecorator = transformClassExportBeforeDecorator;
//# sourceMappingURL=transformer.js.map