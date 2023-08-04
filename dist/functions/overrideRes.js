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
exports.overrideRes = void 0;
var strings_1 = require("../constants/strings");
var types_1 = require("../types");
var postMessage_1 = require("./utils/postMessage");
var overrideObj = {
    _id: -1,
    _tid: -1,
    transferCall: function transferCall(call) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (0, postMessage_1.postParent)({
            cmd: types_1.ChildCmd.response,
            call: call,
            args: args,
            id: this._id,
            tid: this._tid
        });
        return this;
    },
    append: function append() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["append"], args, false));
    },
    attachment: function attachment() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["attachment"], args, false));
    },
    cookie: function cookie() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["cookie"], args, false));
    },
    clearCookie: function clearCookie() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["clearCookie"], args, false));
    },
    download: function download() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["download"], args, false));
    },
    end: function end() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["end"], args, false));
    },
    format: function format() {
        var _args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _args[_i] = arguments[_i];
        }
        throw new Error(strings_1.notImplemented);
    },
    get: function get() {
        throw new Error(strings_1.notImplemented);
    },
    json: function json() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["json"], args, false));
    },
    jsonp: function jsonp() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["jsonp"], args, false));
    },
    links: function links() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["links"], args, false));
    },
    location: function location() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["location"], args, false));
    },
    redirect: function redirect() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["redirect"], args, false));
    },
    render: function render() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["render"], args, false));
    },
    send: function send() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["send"], args, false));
    },
    sendFile: function sendFile() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["sendFile"], args, false));
    },
    sendStatus: function sendStatus() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["sendStatus"], args, false));
    },
    set: function set() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["set"], args, false));
    },
    status: function status() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["status"], args, false));
    },
    type: function type() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["type"], args, false));
    },
    vary: function vary() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.transferCall.apply(this, __spreadArray(["vary"], args, false));
    }
};
function overrideRes(_id, _tid) {
    var obj = Object.create(overrideObj);
    obj._id = _id;
    obj._tid = _tid;
    return obj;
}
exports.overrideRes = overrideRes;
//# sourceMappingURL=overrideRes.js.map