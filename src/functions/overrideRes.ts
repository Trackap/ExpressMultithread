/* Types */
import { Response } from "express";

/* Constants */
import { notImplemented } from "../constants/strings";
import { ChildCmd } from "../types";
import { postParent } from "./utils/postMessage";

const overrideObj = {
    _id: -1,
    _tid: -1,
    transferCall: function transferCall(call: string, ...args: any[]) {
        postParent({
            cmd: ChildCmd.response,
            call,
            args,
            id: this._id,
            tid: this._tid
        });
        return this as any as Response;
    },
    
    append: function append(...args: any[]) {
        return this.transferCall("append", ...args);
    },
    attachment: function attachment(...args: any[]) {
        return this.transferCall("attachment", ...args);
    },
    cookie: function cookie(...args: any[]) {
        return this.transferCall("cookie", ...args);
    },
    clearCookie: function clearCookie(...args: any[]) {
        return this.transferCall("clearCookie", ...args);
    },
    download: function download(...args: any[]) {// WARNING CALLBACK
        return this.transferCall("download", ...args);
    },
    end: function end(...args: any[]) {
        return this.transferCall("end", ...args);
    },
    format: function format(..._args: any[]) {
        throw new Error(notImplemented);
    },
    get: function get() {
        throw new Error(notImplemented);
    },
    json: function json(...args: any[]) {
        return this.transferCall("json", ...args);
    },
    jsonp: function jsonp(...args: any[]) {
        return this.transferCall("jsonp", ...args);
    },
    links: function links(...args: any[]) {
        return this.transferCall("links", ...args);
    },
    location: function location(...args: any[]) {
        return this.transferCall("location", ...args);
    },
    redirect: function redirect(...args: any[]) {
        return this.transferCall("redirect", ...args);
    },
    render: function render(...args: any[]) {// WARNING CALLBACK
        return this.transferCall("render", ...args);
    },
    send: function send(...args: any[]) {
        return this.transferCall("send", ...args);
    },
    sendFile: function sendFile(...args: any[]) {// WARNING CALLBACK
        return this.transferCall("sendFile", ...args);
    },
    sendStatus: function sendStatus(...args: any[]) {
        return this.transferCall("sendStatus", ...args);
    },
    set: function set(...args: any[]) {
        return this.transferCall("set", ...args);
    },
    status: function status(...args: any[]) {
        return this.transferCall("status", ...args);
    },
    type: function type(...args: any[]) {
        return this.transferCall("type", ...args);
    },
    vary: function vary(...args: any[]) {
        return this.transferCall("vary", ...args);
    }
};

export function overrideRes(_id: number, _tid: string) : Response {
    const obj = Object.create(overrideObj);
    obj._id = _id;
    obj._tid = _tid;
    return obj as any as Response;
}