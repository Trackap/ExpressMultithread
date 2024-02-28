/* Types */
import {Middleware, Callback, Layer, NextContext, ErrorMiddleware } from "../types";
import { Request, Response, NextFunction } from "express";

/* Constants */
import { router, route } from "../constants/strings";

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
            /* Call endpoint */
            await (this.callstack[i] as Callback)(this.req, this.res);
            /* Resolve promise */
            return this.resolve!(undefined);
        },
        /* It's a middleware */
        3: async (i: number, _err?: any) => {
            /* Get next fn */
            const ctx = this.getNext();
            /* Launch promise race between next & middleware fn */
            await Promise.race([(this.callstack[i] as Middleware)(this.req, this.res, ctx.done), ctx.promise]);
            /* Handle next call */
            this.handleNextCall(ctx, i + 1, () => this.exec(i + 1))
        },
        /* It's an error middleware */
        4: async (i: number, err?: any) => {
            /* Skip if no err */
            if (!err)
                return this.exec(i + 1);
            /* Get next fn */
            const ctx = this.getNext();
            await Promise.race([(this.callstack[i] as ErrorMiddleware)(err, this.req, this.res, ctx.done), ctx.promise]);
            /* Handle next call */
            this.handleNextCall(ctx, i + 1, () => this.exec(i + 1))
        }
    }

    public exec(i = 0, err?: any) {
        /* End of callstack or bad call */
        if (i === this.callstack.length || this.callstack[i].length < 2 || this.callstack[i].length > 4)
            return err ? this.reject!(err) : this.resolve!(undefined);
        this.handler[this.callstack[i].length](i, err)
            .catch((e: any) => this.goError(i + 1, e));
    }

    private getNext() : NextContext {
        /* Create base obj */
        const ret : Record<string, any> = {
            nextCalled: false,
        };
        /* Add promise to context */
        ret.promise = new Promise((solve) => {
            /* Create passed next fn */
            ret.done = (arg?: any) => {
                ret.nextCalled = true;
                solve(arg);
            };
            /* Register solve fn to avoid loosing promise */
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
        } else {
            /* Solve promise in case next was not called */
            ctx.complete()
            this.resolve!(undefined)
        }
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