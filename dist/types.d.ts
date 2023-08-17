/// <reference types="node" />
import { Request, Response, NextFunction } from "express";
import { Worker } from "worker_threads";
export type RouteMethod = "get" | "post" | "put" | "delete" | "patch" | "head" | "options";
export type Callback = (req: Request, res: Response) => (any | Promise<any>);
export type Middleware = (req: Request, res: Response, next: NextFunction) => (any | Promise<any>);
export type Serializable = string | number | boolean | bigint | undefined | {
    [key: string]: Serializable;
} | Serializable[];
export interface Constructor {
    new (...args: any[]): {};
}
export interface SerializedMiddleware {
    path: string;
    opts: Serializable[];
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
    addMiddleware = 1,
    request = 2
}
export interface Msg<T extends ParentCmd | ChildCmd> {
    cmd: T;
}
export interface Import {
    module: string;
    path: string;
    packed: boolean;
}
