import { getCodeMethod, getCodeConstructor } from '../code';
import { ExportNamedDeclaration, ClassDeclaration } from '../ast';
import { getArgs } from './utils/getArgs';

export function transformClass(
    root: ExportNamedDeclaration,
    srcFilePath: string,
    path: string,
    withTypes: boolean,
    noDecorator: boolean,
) {
    if (root.declaration.type === 'ClassDeclaration') {
        if (checkIfClassImplementInterface(root.declaration, 'IsomorShare')) {
            return root;
        }
        if (!noDecorator && checkIfClassContainDecorator(root.declaration, 'isomorShare')) {
            return transformClassExportBeforeDecorator(root);
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
                    const args = getArgs((root as any).declaration.body.body[index], srcFilePath, path, name, className);
                    (root as any).declaration.body.body[index] = getCodeMethod(path, name, className, args, withTypes);
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

/**
 * Check if @isomor decorator is enabled. If not we can just transpile the full class
 * If yes, we need to check that @isomor is on the top of the class to allow transform.
 */
function checkForIsomorDecorator(
    root: ClassDeclaration,
    noDecorator: boolean,
) {
    return noDecorator || checkIfClassContainDecorator(root, 'isomor');
}

function checkIfClassImplementInterface(
    root: ClassDeclaration,
    name: string,
) {
    if (root.implements) {
        return root.implements.filter(
            (node) =>
                node.type === 'TSExpressionWithTypeArguments'
                && node.expression.type === 'Identifier'
                && node.expression.name === name,
        ).length > 0;
    }
    return false;
}

function checkIfClassContainDecorator(
    root: ClassDeclaration,
    name: string,
) {
    if (!root.decorators || !root.decorators.length) {
        return false;
    } else {
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
