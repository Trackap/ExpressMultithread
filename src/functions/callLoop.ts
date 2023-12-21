/* Types */
import {Middleware, Callback, Layer, NextContext, ErrorMiddleware } from "../types";
import { Request, Response, NextFunction } from "express";

/* Constants */
import { router, route } from "../constants/strings";

export function callLoop(req: Request, res: Response, _callstack: Layer[]) {
    return new Promise<any>(async (resolve, reject) => {
        let i = -1;
        /* Iterate on callstack */
        while (++i < _callstack.length) {
            const layer = _callstack[i];
            /* If it's a callback */
            if (layer.length === 2) {
                try {
                    await (layer as Callback)(req, res);
                } catch (e) {
                    reject(e);
                }
            /* It's a middleware */
            } else {
                /* Create next() function */
                let done : undefined | NextFunction = undefined;
                let nextCalled : boolean = false;
                const promise : Promise<any> = new Promise((solve) => {
                    done = (arg?: any) => {
                        nextCalled = true;
                        solve(arg);
                    }
                });
                /* Exec middleware */
                await Promise.race([(layer as Middleware)(req, res, done!), promise]);
                /* If next() was called with args, we can't continue */
                if (nextCalled) {
                    /* Be sure to resolve the next call */
                    const res = (await promise);
                    /* Handle next("route") and next("router") */
                    if (res === "route" || res === "router") {
                        return resolve(res);
                    /* Handle errors */
                    } else if (res) {
                        return reject(res);
                    }
                    /* If next() was called without args, we can continue */
                /* Else, return used in the middleware */
                } else {
                    break;
                }
            }
        }
        resolve(undefined);
    });
}



export class CallLoop {
    private req : Request;
    private res : Response;
    private callstack : Layer[];
    private resolve?: (value: unknown) => void;
    private reject?: (value: unknown) => void;

    constructor(req : Request, res: Response, callstack: Layer[]) {
        this.req = req;
        this.res = res;
        this.callstack = callstack;
    }

    public handle() {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.exec();
        });
    }

    private handler = {
        /* It's a callback */
        2: async (i: number, _err?: any) => {
            await (this.callstack[i] as Callback)(this.req, this.res);
            return this.resolve!(undefined);
        },
        /* It's a middleware */
        3: async (i: number, _err?: any) => {
            const ctx = this.getNext();
            await Promise.race([(this.callstack[i] as Middleware)(this.req, this.res, ctx.done), ctx.promise]);
            /* Handle next call */
            this.handleNextCall(ctx, i + 1, () => this.exec(i + 1))
        },
        /* It's an error middleware */
        4: async (i: number, err?: any) => {
            /* Skip if no err */
            if (!err)
                return this.exec(i + 1);
            const ctx = this.getNext();
            await Promise.race([(this.callstack[i] as ErrorMiddleware)(err, this.req, this.res, ctx.done), ctx.promise]);
            /* Handle next call */
            this.handleNextCall(ctx, i + 1, () => this.exec(i + 1))
        }
    }

    public exec(i = 0, err?: any) {
        /* End of callstack */
        if (i === this.callstack.length)
            return err ? this.reject!(err) : this.resolve!(undefined);
        this.handler[this.callstack[i].length](i, err)
            .catch((e: any) => this.goError(i + 1, e));
    }

    private getNext() : NextContext {
        const ret : Record<string, any> = {
            nextCalled: false,
        };
        ret.promise = new Promise((solve) => {
            ret.done = (arg?: any) => {
                ret.nextCalled = true;
                solve(arg);
            };
            ret.complete = solve;
        });
        return ret as unknown as NextContext;
    }

    private handleNextCall(ctx: NextContext, i : number, cb: () => void){
        if (ctx.nextCalled) {
            ctx.promise
                .then((r) => {
                    if (r === route || r === router)
                        this.resolve!(r)
                    else if (r)
                        this.goError(i, r);
                    else
                        cb()
                })
        }
        /* Solve promise in case next was not called */
        !ctx.nextCalled && ctx.complete();
    }

    private goError(i: number, err: any) {
        /* Fetch next error middleware */
        for (let j = i; j < this.callstack.length; j++) {
            if (this.callstack[j].length === 4)
                return this.exec(i, err);
        }
        /* No error middleware reject */
        return this.exec(this.callstack.length, err);
    }
}