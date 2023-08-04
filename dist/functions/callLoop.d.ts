import { Middleware, Callback } from "../types";
import { Request, Response } from "express";
export declare function callLoop(req: Request, res: Response, _callstack: (Middleware | Callback)[]): Promise<any>;
