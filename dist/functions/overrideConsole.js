"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revert = exports.override = void 0;
var worker_threads_1 = require("worker_threads");
var strings_1 = require("../constants/strings");
var orig = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
};
if (worker_threads_1.isMainThread)
    throw new Error(strings_1.noMain);
var override = function (id) {
    var base = strings_1.Reset + strings_1.space + strings_1.bRight + id.toString() + strings_1.bLeft + strings_1.space;
    console.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return orig.log.apply(orig, __spreadArray([strings_1.FgGray + strings_1.logConsole + base], args, false));
    };
    console.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return orig.info.apply(orig, __spreadArray([strings_1.FgCyan + strings_1.infoConsole + base], args, false));
    };
    console.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return orig.warn.apply(orig, __spreadArray([strings_1.FgYellow + strings_1.warnConsole + base], args, false));
    };
    console.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return orig.error.apply(orig, __spreadArray([strings_1.FgRed + strings_1.errorConsole + base], args, false));
    };
};
exports.override = override;
var revert = function () {
    console.log = orig.log;
    console.info = orig.info;
    console.warn = orig.warn;
    console.error = orig.error;
};
exports.revert = revert;
//# sourceMappingURL=overrideConsole.js.map