import { watch } from 'chokidar';

// import anymatch from 'anymatch'; // ts issues https://github.com/micromatch/anymatch/issues/29
const anymatch = require('anymatch'); // tslint:disable-line

// function getServerSubFolderPattern(serverFolderPattern: string) {
//     return join(serverFolderPattern, '**', '*');
// }

// export const watcherUpdate = (options: Options) => async (file: string) => {
//     const { srcFolder, serverFolder, distAppFolder, watchMode } = options;
//     const serverFolderPattern = getFilesPattern(serverFolder);
//     const path = join(srcFolder, file);

//     if (anymatch(getServerSubFolderPattern(serverFolderPattern), path)) {
//         info(`Do not copy sub-folder from "./server"`, path);
//     } else if (anymatch(serverFolderPattern, path)) {
//         transpile(options, file);
//     } else {
//         info(`Copy ${path} to folder`);
//         const dest = join(distAppFolder, file);
//         copy(path, dest);
//         // const content = await readFile(path);
//         // await outputFile(dest, content);

//         if (watchMode) {
//             // try to fix file that does not get copy correctly
//             setTimeout(() => watcherUpdateSpy(path, dest), 200); // should not be necessary anymore
//         }
//     }
// };

// async function watcherUpdateSpy(path: string, dest: string, retry = 0) {
//     const contentA = await readFile(path);
//     const contentB = await readFile(dest);
//     if (contentA.toString() !== contentB.toString()) {
//         warn('We found file diff, copy again', dest);
//         await outputFile(dest, contentA);
//         if (retry < 2) {
//             setTimeout(() => watcherUpdateSpy(path, dest, retry + 1), 200);
//         }
//     }
// }

// function watcher(options: Options) {
//     const { srcFolder, serverFolder, watchMode, distAppFolder } = options;
//     if (watchMode) {
//         info('Starting watch mode.');
//         const serverFolderPattern = getFilesPattern(serverFolder);
//         watch('.', {
//             ignoreInitial: true,
//             ignored: getServerSubFolderPattern(serverFolderPattern),
//             cwd: srcFolder,
//             usePolling: process.env.CHOKIDAR_USEPOLLING === 'true',
//         })
//             .on('ready', () =>
//                 info('Initial scan complete. Ready for changes...'),
//             )
//             .on('add', (file) => {
//                 info(`File ${file} has been added`);
//                 // watcherUpdate(file);
//                 setTimeout(() => watcherUpdate(options)(file), 100);
//             })
//             .on('change', (file) => {
//                 info(`File ${file} has been changed`);
//                 // watcherUpdate(file);
//                 setTimeout(() => watcherUpdate(options)(file), 100);
//             })
//             .on('unlink', (file) => {
//                 info(`File ${file} has been removed`, '(do nothing)');
//                 const path = join(distAppFolder, file);
//                 unlink(path);
//             });
//     }
// }