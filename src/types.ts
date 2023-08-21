/* Types */
import { Request, Response, NextFunction } from "express";
import { Worker } from "worker_threads";

export type RouteMethod = "get" | "post" | "put" | "delete" | "patch" | "head" | "options";

export type Callback = (req: Request, res: Response) => (any | Promise<any>);

export type Middleware = (req: Request, res: Response, next: NextFunction) => (any | Promise<any>);

export type Serializable = string
| number
| boolean
| bigint
| undefined
| {[key: string]: Serializable}
| Serializable[];

export interface Constructor { new (...args: any[]): {} };

export interface SerializedMiddleware {
    path: string;
    opts: Serializable[];
};

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
};

export interface Task {
    endpoint: string;
    req: Request;
    res: Response;
    next: NextFunction;
    id: string;
};

export interface ChildData {
    id: number;
    instance: Worker;
    ready: boolean;
    tasks: Task[];
};

export enum ChildCmd {
    ready = 0,
    response = 1,
    next = 2
};

export enum ParentCmd {
    addSource = 0,
    addMiddleware = 1,
    request = 2
};

export interface Msg<T extends ParentCmd | ChildCmd>{
    cmd: T;
};

export interface Import {
    module: string;
    path: string;
    packed: boolean;
};

export type ObjectPrototype<T> = Record<string, PropertyDescriptor> & Record<string, TypedPropertyDescriptor<T>>;

export enum PluginType {
    controllerDecorator = 0,
    routeDecorator = 1
};

export interface PluginBase {
    __id: string;
    kind: PluginType;
    cb: Function;
};

export interface PluginRoute extends PluginBase {
    kind: PluginType.routeDecorator;
    cb: (route: InternalRoute, propertyKey : string, proto: ObjectPrototype<InternalRoute>) => void;
};

export interface PluginController extends PluginBase {
    kind: PluginType.controllerDecorator;
    cb: (controller : ControllerDecoratorOpts, proto: ObjectPrototype<ControllerDecoratorOpts>) => void;
};

export interface BaseConfig {
    threadCount?: number;
    cleanRequest?: (req: Request) => Request;
    plugins?: string[];
};