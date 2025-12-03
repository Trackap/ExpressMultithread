/* Types */
import { Response } from "express";

/* Constants */
import { notImplemented } from "../constants/strings";
import { ChildCmd, Serializable } from "../types";
import { postParent } from "./utils/postMessage";

const internalProps = ["_id", "_tid"];
const notImplementedProps = ["format", "get"];

const handler: ProxyHandler<any> = {
    get(target, prop, receiver) {
        /* Internal props */
        if (internalProps.includes(prop as string)) {
            /* Return internal props */
            return target[prop];
        }
        /* Methods that are not implemented */
        if (notImplementedProps.includes(prop as string)) {
            /* Return throwing function */
            return function () {
                throw new Error(notImplemented);
            };
        }
        /* Else */
        return function (...args: Serializable[]) {
            /* Post to parent informations */
            postParent({
                cmd: ChildCmd.response,
                call: prop,
                args,
                id: target._id,
                tid: target._tid
            });
            /* Return receiver for chaining */
            return receiver;
        };
    },
    set(target, prop, value) {
        if (internalProps.includes(prop as string)) {
            target[prop] = value;
        }
        return value;
    }
};

export function overrideRes(_id: number, _tid: string): Response {
    /* Return proxied response */
    return new Proxy({ _id, _tid }, handler) as any as Response;
}