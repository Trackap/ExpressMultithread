"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
var cleanRequest_1 = require("../functions/cleanRequest");
var mergeObject_1 = require("../functions/utils/mergeObject");
var strings_1 = require("../constants/strings");
var Config = (function () {
    function Config() {
        this._orig = cleanRequest_1.cleanRequest;
        this._custom = undefined;
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
            var _this = this;
            if (this._custom) {
                return function (req) { return (0, mergeObject_1.merge)(_this._custom(req), _this._orig(req)); };
            }
            return this._orig;
        },
        set: function (value) {
            this._custom = value;
        },
        enumerable: false,
        configurable: true
    });
    ;
    ;
    return Config;
}());
;
var Instance = new Config();
if (isNaN(Instance.threadCount) || Instance.threadCount < 0)
    throw new Error(strings_1.invalidThreadCount);
exports.default = Instance;
//# sourceMappingURL=Config.js.map