"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
var cleanRequest_1 = require("../functions/cleanRequest");
var strings_1 = require("../constants/strings");
var Config = (function () {
    function Config() {
        this._cleanRequest = cleanRequest_1.cleanRequest;
        this._threadCount = process.env.THREAD_COUNT === undefined ? (0, os_1.cpus)().length : parseInt(process.env.THREAD_COUNT);
    }
    Object.defineProperty(Config.prototype, "threadCount", {
        get: function () {
            return this._threadCount;
        },
        set: function (value) {
            this._threadCount = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Config.prototype, "cleanRequest", {
        get: function () {
            return this._cleanRequest;
        },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(Config.prototype, "setCleanRequest", {
        set: function (value) {
            this._cleanRequest = value;
        },
        enumerable: false,
        configurable: true
    });
    ;
    return Config;
}());
;
var Instance = new Config();
if (isNaN(Instance.threadCount) || Instance.threadCount < 0)
    throw new Error(strings_1.invalidThreadCount);
exports.default = Instance;
//# sourceMappingURL=Config.js.map