"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const cleanRequest_1 = require("../functions/cleanRequest");
const mergeObject_1 = require("../functions/utils/mergeObject");
const strings_1 = require("../constants/strings");
class Config {
    constructor() {
        this._orig = cleanRequest_1.cleanRequest;
        this._custom = undefined;
        this._threadCount = process.env.THREAD_COUNT === undefined ? (0, os_1.cpus)().length : parseInt(process.env.THREAD_COUNT);
        this._ext = strings_1.tsFile;
    }
    get threadCount() {
        return this._threadCount;
    }
    set threadCount(value) {
        this._threadCount = value;
    }
    get cleanRequest() {
        if (this._custom) {
            return (req) => (0, mergeObject_1.merge)(this._custom(req), this._orig(req));
        }
        return this._orig;
    }
    ;
    set cleanRequest(value) {
        this._custom = value;
    }
    ;
    get ext() {
        return this._ext;
    }
    ;
    set ext(value) {
        this._ext = value;
    }
}
;
const Instance = new Config();
if (isNaN(Instance.threadCount) || Instance.threadCount < 0)
    throw new Error(strings_1.invalidThreadCount);
exports.default = Instance;
//# sourceMappingURL=Config.js.map