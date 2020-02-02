"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const code_1 = require("../code");
const validation_1 = require("../validation");
function transformClass(root, _a, noDecorator) {
    var { srcFilePath, path, withTypes } = _a, bodyParams = __rest(_a, ["srcFilePath", "path", "withTypes"]);
    if (root.declaration.type === 'ClassDeclaration') {
        if (checkIfClassImplementInterface(root.declaration, 'IsomorShare')) {
            return root;
        }
        if (!noDecorator && checkIfClassContainDecorator(root.declaration, 'isomorShare')) {
            return transformClassExportBeforeDecorator(root);
        }
        if (!checkForIsomorDecorator(root.declaration, noDecorator)) {
            return;
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
                    validation_1.setValidator(root.declaration.body.body[index], srcFilePath, path, name, className);
                    root.declaration.body.body[index] = code_1.getCodeMethod({
                        withTypes,
                        bodyParams: Object.assign({ path, name, className }, bodyParams),
                    });
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
function checkForIsomorDecorator(root, noDecorator) {
    return noDecorator || checkIfClassContainDecorator(root, 'isomor');
}
function checkIfClassImplementInterface(root, name) {
    if (root.implements) {
        return root.implements.filter((node) => node.type === 'TSExpressionWithTypeArguments'
            && node.expression.type === 'Identifier'
            && node.expression.name === name).length > 0;
    }
    return false;
}
function checkIfClassContainDecorator(root, name) {
    if (!root.decorators || !root.decorators.length) {
        return false;
    }
    else {
        let isomorFound = false;
        root.decorators.forEach(decorator => {
            if (decorator.expression.type === 'Identifier'
                && decorator.expression.name === name) {
                isomorFound = true;
                return;
            }
        });
        if (!isomorFound) {
            return false;
        }
    }
    return true;
}
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
//# sourceMappingURL=transformClass.js.map