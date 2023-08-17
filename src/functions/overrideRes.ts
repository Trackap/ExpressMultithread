/* Types */
import { Response } from "express";

/* Constants */
import { notImplemented } from "../constants/strings";
import { ChildCmd, Serializable } from "../types";
import { postParent } from "./utils/postMessage";

const overrideObj = {
    _id: -1,
    _tid: -1,
    transferCall: function transferCall(call: string, ...args: Serializable[]) {
        postParent({
            cmd: ChildCmd.response,
            call,
            args,
            id: this._id,
            tid: this._tid
        });
        return this as any as Response;
    },
    
    append: function append(...args: Serializable[]) {
        return this.transferCall("append", ...args);
    },
    attachment: function attachment(...args: Serializable[]) {
        return this.transferCall("attachment", ...args);
    },
    cookie: function cookie(...args: Serializable[]) {
        return this.transferCall("cookie", ...args);
    },
    clearCookie: function clearCookie(...args: Serializable[]) {
        return this.transferCall("clearCookie", ...args);
    },
    download: function download(...args: Serializable[]) {// WARNING CALLBACK
        return this.transferCall("download", ...args);
    },
    end: function end(...args: Serializable[]) {
        return this.transferCall("end", ...args);
    },
    format: function format(..._args: Serializable[]) {
        throw new Error(notImplemented);
    },
    get: function get() {
        throw new Error(notImplemented);
    },
    json: function json(...args: Serializable[]) {
        return this.transferCall("json", ...args);
    },
    jsonp: function jsonp(...args: Serializable[]) {
        return this.transferCall("jsonp", ...args);
    },
    links: function links(...args: Serializable[]) {
        return this.transferCall("links", ...args);
    },
    location: function location(...args: Serializable[]) {
        return this.transferCall("location", ...args);
    },
    redirect: function redirect(...args: Serializable[]) {
        return this.transferCall("redirect", ...args);
    },
    render: function render(...args: Serializable[]) {// WARNING CALLBACK
        return this.transferCall("render", ...args);
    },
    send: function send(...args: Serializable[]) {
        return this.transferCall("send", ...args);
    },
    sendFile: function sendFile(...args: Serializable[]) {// WARNING CALLBACK
        return this.transferCall("sendFile", ...args);
    },
    sendStatus: function sendStatus(...args: Serializable[]) {
        return this.transferCall("sendStatus", ...args);
    },
    set: function set(...args: Serializable[]) {
        return this.transferCall("set", ...args);
    },
    setHeader: function set(...args: Serializable[]) {
        return this.transferCall("setHeader", ...args);
    },
    status: function status(...args: Serializable[]) {
        return this.transferCall("status", ...args);
    },
    type: function type(...args: Serializable[]) {
        return this.transferCall("type", ...args);
    },
    vary: function vary(...args: Serializable[]) {
        return this.transferCall("vary", ...args);
    }
};

export function overrideRes(_id: number, _tid: string) : Response {
    const obj = Object.create(overrideObj);
    obj._id = _id;
    obj._tid = _tid;
    return obj as any as Response;
}