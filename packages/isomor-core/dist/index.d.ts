export interface ValidationSchema {
    args: string[];
    schema: any;
}
export declare function getFilesPattern(folderToSearch: string): string;
export declare function getFiles(rootFolder: string, folderToSearch: string): Promise<string[]>;
export declare function getFolders(rootFolder: string, folderToSearch: string): Promise<string[]>;
export declare function getPathForUrl(path: string): string;
