/* Modules */
import { isMainThread } from "worker_threads";

/* Classes */
import Parent from "../class/Parent";

/* Types */
import { Request, Response } from "express";
import { Callback } from "../types";

/* Constants */
import { noMain } from "../constants/strings";

export function wrapRequest(key: string) : Callback {
    if (!isMainThread)
        throw new Error(noMain);
    return (req: Request, res: Response) => {
        Parent!.addTask(key, req, res);
    };
};