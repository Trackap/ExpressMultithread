"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentCmd = exports.ChildCmd = void 0;
;
;
var ChildCmd;
(function (ChildCmd) {
    ChildCmd[ChildCmd["ready"] = 0] = "ready";
    ChildCmd[ChildCmd["response"] = 1] = "response";
    ChildCmd[ChildCmd["next"] = 2] = "next";
})(ChildCmd || (exports.ChildCmd = ChildCmd = {}));
var ParentCmd;
(function (ParentCmd) {
    ParentCmd[ParentCmd["addSource"] = 0] = "addSource";
    ParentCmd[ParentCmd["addMiddleware"] = 1] = "addMiddleware";
    ParentCmd[ParentCmd["request"] = 2] = "request";
})(ParentCmd || (exports.ParentCmd = ParentCmd = {}));
//# sourceMappingURL=types.js.map