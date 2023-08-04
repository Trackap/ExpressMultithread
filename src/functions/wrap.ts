/* Modules */
import { isMainThread } from "worker_threads";

/* Classes */
import Parent from "../class/Parent";

/* Types */
import { Request, Response, NextFunction } from "express";
import { Middleware } from "../types";

/* Constants */
import { noMain } from "../constants/strings";

export function wrapRequest(key: string) : Middleware {
    if (!isMainThread)
        throw new Error(noMain);
    return (req: Request, res: Response, next: NextFunction) => {
        Parent!.addTask(key, req, res, next);
    };
};