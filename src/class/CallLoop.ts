/* Functions */
import { postParent } from "../functions/utils/postMessage";
import { makeObj } from "../functions/utils/makeObj";

/* Types */
import { Middleware, Callback, Layer, ErrorMiddleware, ChildCmd, Serializable } from "../types";
import { Request, Response, NextFunction } from "express";

/* Constants */
import { router, route } from "../constants/strings";

export class CallLoop {
    private req : Request;
    private res : Response;
    private callstack : Layer[];

    constructor(req : Request, res: Response, callstack: Layer[]) {
        this.req = req;
        this.res = res;
        this.callstack = callstack;
    }

    private pNext(arg: Serializable) {
        postParent({
            cmd: ChildCmd.next,
            id: (this.res as any)._id,
            tid: (this.res as any)._tid,
            arg
        })
    }

    private handler = {
        /* It's a callback */
        2: (i: number, _err?: any) => {
            /* Call endpoint */
            (this.callstack[i] as Callback)(this.req, this.res);
        },
        /* It's a middleware */
        3: (i: number, _err?: any) => {
            /* Call middleware */
            (this.callstack[i] as Middleware)(this.req, this.res, this.getNext(i + 1))
        },
        /* It's an error middleware */
        4: (i: number, err?: any) => {
            /* Skip if no err */
            if (!err)
                return this.handle(i + 1);
            /* Call error middleware */
            (this.callstack[i] as ErrorMiddleware)(err, this.req, this.res, this.getNext(i + 1));
        }
    }

    public handle(i = 0, err?: any) {
        /* End of callstack or bad call */
        if (i === this.callstack.length || this.callstack[i].length < 2 || this.callstack[i].length > 4)
            return this.pNext(
                err ? makeObj(err, Object.getOwnPropertyNames(err))
                : undefined
            )
        try {
            this.handler[this.callstack[i].length](i, err)
        } catch (e) {
            this.goError(i + 1, e);
        }
    }

    private getNext(index: number): NextFunction {
        return (arg?: any | "route" | "router") => {
            if (arg === route || arg === router) {
                /* If next is called with route or router, resolve with it */
                this.pNext(arg);
            } else if (arg) {
                /* Jump to next error middleware */
                this.goError(index, arg);
            } else {
                /* Go to next callstack elem */
                this.handle(index);
            }
        }
    }

    private goError(i: number, err: any) {
        /* Fetch next error middleware */
        for (let j = i; j < this.callstack.length; j++) {
            if (this.callstack[j].length === 4)
                return this.handle(j, err);
        }
        /* No error middleware reject */
        return this.handle(this.callstack.length, err);
    }
}