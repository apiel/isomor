import { EventEmitter } from 'events';

export const eventEmitter = new EventEmitter();

export enum Action {
    UpdateTs = 'UpdateTs',
    UpdateDTs = 'UpdateDTs',
    UpdateJs = 'UpdateJs',
}

export function updateTsFileInSrc(file: string) {
    eventEmitter.emit(Action.UpdateTs, file);
}

export function updateJsFileInSrc(file: string) {
    eventEmitter.emit(Action.UpdateJs, file);
}

export function updateDTsFile(file: string) {
    eventEmitter.emit(Action.UpdateDTs, file);
}
