## VScode

To make the development process more fluid, there is a VScode extension. It's main purpose is to replace `isomor-transpiler` watcher by triggering transpiler when file is edited VScode. This might be more reliable than using file system event (from chokidar) and will as well save resources.

To install it launch VS Code Quick Open (Ctrl+P), paste the following command, and press enter.
```
ext install apiel.isomor-vscode
```

Find as well the extension on the visual studio marketplace, [here](https://marketplace.visualstudio.com/items?itemName=apiel.isomor-vscode).

> **Note:** Instead to run your projects using `yarn dev`, run it using `yarn code`.
