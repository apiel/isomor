## VScode

Deprecated for the moment (need to find credential to publish new version)
--> the new version should use the transpiler from the node_module of the current folder to transpile instead to load his own transpiler. Doing this we will not have to update extension for each new transpiler version and it will as well allow to support different transpiler versions

To make the development process more fluid, there is a VScode extension. It's main purpose is to replace `isomor-transpiler` watcher by triggering transpiler when file is edited VScode. This might be more reliable than using file system event (from chokidar) and will as well save resources.

To install it launch VS Code Quick Open (Ctrl+P), paste the following command, and press enter.
```
ext install apiel.isomor-vscode
```

Find as well the extension on the visual studio marketplace, [here](https://marketplace.visualstudio.com/items?itemName=apiel.isomor-vscode).

> **Note:** Instead to run your projects using `yarn dev`, run it using `yarn code`.
