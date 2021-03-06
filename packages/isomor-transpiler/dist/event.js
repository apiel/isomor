"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
exports.eventEmitter = new events_1.EventEmitter();
var Action;
(function (Action) {
    Action["UpdateTs"] = "UpdateTs";
    Action["UpdateDTs"] = "UpdateDTs";
    Action["UpdateJs"] = "UpdateJs";
})(Action = exports.Action || (exports.Action = {}));
function updateTsFileInSrc(file) {
    exports.eventEmitter.emit(Action.UpdateTs, file);
}
exports.updateTsFileInSrc = updateTsFileInSrc;
function updateJsFileInSrc(file) {
    exports.eventEmitter.emit(Action.UpdateJs, file);
}
exports.updateJsFileInSrc = updateJsFileInSrc;
function updateDTsFile(file) {
    exports.eventEmitter.emit(Action.UpdateDTs, file);
}
exports.updateDTsFile = updateDTsFile;
//# sourceMappingURL=event.js.map