/// <reference types="node" />
import { Request, Response, NextFunction } from "express";
import { Worker } from "worker_threads";
export type RouteMethod = "get" | "post" | "put" | "delete" | "patch" | "head" | "options";
export type Callback = (req: Request, res: Response) => (any | Promise<any>);
export type Middleware = (req: Request, res: Response, next: NextFunction) => (any | Promise<any>);
export interface Constructor {
    new (...args: any[]): {};
}
export type ControllerDecoratorOpts = {
    path?: string;
    middlewares?: (Middleware | Middleware[]);
};
export interface InternalRoute {
    method: RouteMethod;
    path: string;
    middlewares: Middleware[];
    cb: Callback;
    callstack?: (Middleware | Callback)[];
    endpoint?: string;
}
export interface Task {
    endpoint: string;
    req: Request;
    res: Response;
    next: NextFunction;
    id: string;
}
export interface ChildData {
    id: number;
    instance: Worker;
    ready: boolean;
    tasks: Task[];
}
export declare enum ChildCmd {
    ready = 0,
    response = 1,
    next = 2
}
export declare enum ParentCmd {
    addSource = 0,
    request = 1
}
export interface Msg<T extends ParentCmd | ChildCmd> {
    cmd: T;
}
