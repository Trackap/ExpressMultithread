"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.overrideRes = void 0;
const strings_1 = require("../constants/strings");
const types_1 = require("../types");
const postMessage_1 = require("./utils/postMessage");
const overrideObj = {
    _id: -1,
    _tid: -1,
    transferCall: function transferCall(call, ...args) {
        (0, postMessage_1.postParent)({
            cmd: types_1.ChildCmd.response,
            call,
            args,
            id: this._id,
            tid: this._tid
        });
        return this;
    },
    append: function append(...args) {
        return this.transferCall("append", ...args);
    },
    attachment: function attachment(...args) {
        return this.transferCall("attachment", ...args);
    },
    cookie: function cookie(...args) {
        return this.transferCall("cookie", ...args);
    },
    clearCookie: function clearCookie(...args) {
        return this.transferCall("clearCookie", ...args);
    },
    download: function download(...args) {
        return this.transferCall("download", ...args);
    },
    end: function end(...args) {
        return this.transferCall("end", ...args);
    },
    format: function format(..._args) {
        throw new Error(strings_1.notImplemented);
    },
    get: function get() {
        throw new Error(strings_1.notImplemented);
    },
    json: function json(...args) {
        return this.transferCall("json", ...args);
    },
    jsonp: function jsonp(...args) {
        return this.transferCall("jsonp", ...args);
    },
    links: function links(...args) {
        return this.transferCall("links", ...args);
    },
    location: function location(...args) {
        return this.transferCall("location", ...args);
    },
    redirect: function redirect(...args) {
        return this.transferCall("redirect", ...args);
    },
    render: function render(...args) {
        return this.transferCall("render", ...args);
    },
    send: function send(...args) {
        return this.transferCall("send", ...args);
    },
    sendFile: function sendFile(...args) {
        return this.transferCall("sendFile", ...args);
    },
    sendStatus: function sendStatus(...args) {
        return this.transferCall("sendStatus", ...args);
    },
    set: function set(...args) {
        return this.transferCall("set", ...args);
    },
    status: function status(...args) {
        return this.transferCall("status", ...args);
    },
    type: function type(...args) {
        return this.transferCall("type", ...args);
    },
    vary: function vary(...args) {
        return this.transferCall("vary", ...args);
    }
};
function overrideRes(_id, _tid) {
    const obj = Object.create(overrideObj);
    obj._id = _id;
    obj._tid = _tid;
    return obj;
}
exports.overrideRes = overrideRes;
//# sourceMappingURL=overrideRes.js.map