"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapRequest = void 0;
var worker_threads_1 = require("worker_threads");
var Parent_1 = __importDefault(require("../class/Parent"));
var strings_1 = require("../constants/strings");
function wrapRequest(key) {
    if (!worker_threads_1.isMainThread)
        throw new Error(strings_1.noMain);
    return function (req, res, next) {
        Parent_1.default.addTask(key, req, res, next);
    };
}
exports.wrapRequest = wrapRequest;
;
//# sourceMappingURL=wrap.js.map