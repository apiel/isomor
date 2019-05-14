import { getCodeMethod, getCodeConstructor } from './code';
import { ExportNamedDeclaration } from './ast';
import { JsonAst } from './ast';
import { ClassDeclaration } from '@babel/types';

export function transformClass(
    root: ExportNamedDeclaration,
    path: string,
    withTypes: boolean,
    noDecorator: boolean,
) {
    if (root.declaration.type === 'ClassDeclaration') {
        if (checkForIsomorShare(root.declaration)) {
            return root;
        }
        // Class didn't implemented IsomorShare we can transform it
        if (!checkForIsomorDecorator(root.declaration, noDecorator)) {
            return; // isomor decorator is enable, so we need @isomor to transform it
        }
        // console.log('ClassDeclaration', JsonAst(root));
        const { name: className } = root.declaration.id;
        const { body } = root.declaration.body;
        body.forEach((node, index) => {
            if (node.type === 'ClassMethod') {
                const { name } = node.key as any;
                if (name === 'constructor') {
                    (root as any).declaration.body.body[index] = getCodeConstructor(withTypes);
                } else {
                    (root as any).declaration.body.body[index] = getCodeMethod(path, name, className, withTypes);
                }
            } else if (node.type !== 'ClassProperty') {
                delete (root as any).declaration.body.body[index];
            }
        });
        return transformClassExportBeforeDecorator(root);
        // return root;
    }
    return;
}

function checkForIsomorShare(
    root: ClassDeclaration,
) {
    if (root.implements) {
        return root.implements.filter(
            (node) =>
                node.type === 'TSExpressionWithTypeArguments'
                && node.expression.type === 'Identifier'
                && node.expression.name === 'IsomorShare',
        ).length > 0;
    }
    return false;
}

/**
 * Check if @isomor decorator is enabled. If not we can just transpile the full class
 * If yes, we need to check that @isomor is on the top of the class to allow transform.
 */
function checkForIsomorDecorator(
    root: ClassDeclaration,
    noDecorator: boolean,
) {
    if (!noDecorator) {
        if (!root.decorators || !root.decorators.length) {
            return false; // isomor decorator is enable, so we need @isomor to transform it
        } else {
            let isomorFound = false;
            root.decorators.forEach(decorator => {
                if (decorator.expression.type === 'Identifier'
                    && decorator.expression.name === 'isomor') {
                        isomorFound = true;
                        return;
                    }
            });
            if (!isomorFound) {
                return false; // isomor decorator is enable, so we need @isomor to transform it
            }
        }
    }
    return true;
}

// https://github.com/babel/babel/issues/7526
// https://github.com/tc39/proposal-decorators/issues/69
// created issue on TS to support it https://github.com/microsoft/TypeScript/issues/31370
export function transformClassExportBeforeDecorator(
    root: any,
) {
    const suffix = '__deco_export__';
    const rootDeco = JSON.parse(JSON.stringify(root.declaration)); // deep copy
    rootDeco.id.name += suffix;
    rootDeco.body.body = [];

    root.declaration.decorators = [];
    root.declaration.superClass = {
        type: 'Identifier',
        name: rootDeco.id.name,
    };

    return [rootDeco, root];
}
