/// <reference types="node" />
import { EventEmitter } from 'events';
export declare const eventEmitter: EventEmitter;
export declare enum Action {
    UpdateTs = "UpdateTs",
    UpdateDTs = "UpdateDTs"
}
export declare function updateTsFileInSrc(file: string): void;
export declare function updateDTsFile(file: string): void;
