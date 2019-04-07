export declare function getFilesPattern(rootFolder: string, folderToSearch: string): string;
export declare function getFiles(rootFolder: string, folderToSearch: string): Promise<string[]>;
export declare function getFolders(rootFolder: string, folderToSearch: string): Promise<string[]>;
export declare function getPathForUrl(filePath: string): string;
