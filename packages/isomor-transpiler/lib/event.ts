import { EventEmitter } from 'events';

export const eventEmitter = new EventEmitter();

export enum Action {
    UpdateTs = 'UpdateTs',
    UpdateDTs = 'UpdateDTs',
}

export function updateTsFileInSrc(file: string) {
    eventEmitter.emit(Action.UpdateTs, file);
}

export function updateDTsFile(file: string) {
    eventEmitter.emit(Action.UpdateDTs, file);
}
