/* Types */
import { Middleware, Callback } from "../types";
import { Request, Response, NextFunction } from "express";

export function callLoop(req: Request, res: Response, _callstack: (Middleware | Callback)[]) {
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
                await Promise.race([layer(req, res, done!), promise]);
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
};