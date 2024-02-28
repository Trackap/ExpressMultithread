/* Modules */
import { isMainThread } from "worker_threads";

/* Classes */
import Parent from "../class/Parent";

/* Types */
import { Request, Response, NextFunction } from "express";
import { Middleware } from "../types";

/* Constants */
import { noMain } from "../constants/strings";
import {randomUUID} from "crypto";

export function wrapRequest(endpoint: string) : Middleware {
    if (!isMainThread)
        throw new Error(noMain);
    return (req: Request, res: Response, next: NextFunction) => {
        Parent!.dispatchTask({
            endpoint,
            req,
            res,
            next,
            id: randomUUID()
        })
    };
}