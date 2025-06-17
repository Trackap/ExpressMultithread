/* Types */
import { Response } from "express";

/* Constants */
import { notImplemented } from "../constants/strings";
import { ChildCmd, Serializable } from "../types";
import { postParent } from "./utils/postMessage";

const handler: ProxyHandler<any> = {
    get(target, prop, receiver) {
        /* Internal props */
        if (prop === "_id" || prop === "_tid") {
            return target[prop];
        }
        /* Transfer call to parent */
        if (prop === "transferCall") {
            return function (call: string, ...args: Serializable[]) {
                postParent({
                    cmd: ChildCmd.response,
                    call,
                    args,
                    id: target._id,
                    tid: target._tid
                });
                return receiver;
            };
        }
        /* Methods that are not implemented */
        const notImpl = ["format", "get"];
        if (notImpl.includes(prop as string)) {
            return function () {
                throw new Error(notImplemented);
            };
        }
        /* Else */
        return function (...args: Serializable[]) {
            return receiver.transferCall(prop, ...args);
        };
    },
    set(target, prop, value) {
        if (prop === "_id" || prop === "_tid") {
            target[prop] = value;
        }
        return value;
    }
};

export function overrideRes(_id: number, _tid: string): Response {
    const target = { _id, _tid };
    return new Proxy(target, handler) as any as Response;
}