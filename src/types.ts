/* Types */
import { Request, Response, NextFunction } from "express";
import { Worker } from "worker_threads";

export type RouteMethod = "get" | "post" | "put" | "delete" | "patch" | "head" | "options";

export type Callback = (req: Request, res: Response) => (any | Promise<any>);

export type Middleware = (req: Request, res: Response, next: NextFunction) => (any | Promise<any>);

export interface Constructor { new (...args: any[]): {} };

export type ControllerDecoratorOpts = {
    path?: string;
    middlewares?: (Middleware | Middleware[]);
};

export interface InternalRoute {
    method: RouteMethod;
    path: string;
    middlewares: Middleware[];
    cb: Callback;
}

export interface Task {
    endpoint: string;
    req: Request;
    res: Response;
    id: string;
}

export interface ChildData {
    id: number;
    instance: Worker;
    ready: boolean;
    tasks: Task[];
}