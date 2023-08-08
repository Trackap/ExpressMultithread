"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revert = exports.override = void 0;
const worker_threads_1 = require("worker_threads");
const strings_1 = require("../constants/strings");
const orig = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
};
if (worker_threads_1.isMainThread)
    throw new Error(strings_1.noMain);
const override = (id) => {
    const base = strings_1.Reset + strings_1.space + strings_1.bRight + id.toString() + strings_1.bLeft + strings_1.space;
    console.log = (...args) => orig.log(strings_1.FgGray + strings_1.logConsole + base, ...args);
    console.info = (...args) => orig.info(strings_1.FgCyan + strings_1.infoConsole + base, ...args);
    console.warn = (...args) => orig.warn(strings_1.FgYellow + strings_1.warnConsole + base, ...args);
    console.error = (...args) => orig.error(strings_1.FgRed + strings_1.errorConsole + base, ...args);
};
exports.override = override;
const revert = () => {
    console.log = orig.log;
    console.info = orig.info;
    console.warn = orig.warn;
    console.error = orig.error;
};
exports.revert = revert;
//# sourceMappingURL=overrideConsole.js.map