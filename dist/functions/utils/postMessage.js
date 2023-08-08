"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postChild = exports.postParent = void 0;
const worker_threads_1 = require("worker_threads");
const strings_1 = require("../../constants/strings");
function postParent(msg) {
    if (worker_threads_1.isMainThread || !worker_threads_1.parentPort)
        throw new Error(strings_1.noMain);
    worker_threads_1.parentPort.postMessage(JSON.stringify(msg));
}
exports.postParent = postParent;
function postChild(child, msg) {
    child.postMessage(JSON.stringify(msg));
}
exports.postChild = postChild;
//# sourceMappingURL=postMessage.js.map