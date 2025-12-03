/* Types */
import { Request, Response, NextFunction } from "express";
import { Worker } from "worker_threads";
import { DispatcherType } from "./constants/strings";

export type RouteMethod = "get" | "post" | "put" | "delete" | "patch" | "head" | "options";

export type Callback = (req: Request, res: Response) => (any | Promise<any>);

export type Middleware = (req: Request, res: Response, next: NextFunction) => (any | Promise<any>);

export type ErrorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => (any | Promise<any>);

export type Layer = Callback | Middleware | ErrorMiddleware;

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
}

export type ControllerDecoratorOpts = {
    path?: string;
    middlewares?: (Middleware | Middleware[]);
}

export interface InternalRoute {
    method: RouteMethod;
    path: string;
    middlewares: Middleware[];
    cb: Callback;
    callstack?: Layer[];
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
    tasks: Map<string, Task>;
}

export enum ChildCmd {
    ready = 0,
    response = 1,
    next = 2
}

export enum ParentCmd {
    setSource = 1,
    request = 2
}

export interface Msg<T extends ParentCmd | ChildCmd>{
    cmd: T;
}

export interface Import {
    module: string;
    path: string;
    packed: boolean;
}

export type ObjectPrototype<T> = Record<string, PropertyDescriptor> & Record<string, TypedPropertyDescriptor<T>>;

export enum PluginType {
    controllerDecorator = 0,
    routeDecorator = 1
}

export interface PluginBase {
    __id: string;
    kind: PluginType;
    cb: Function;
}

export interface PluginRoute extends PluginBase {
    kind: PluginType.routeDecorator;
    cb: (route: InternalRoute, propertyKey : string, proto: ObjectPrototype<InternalRoute>) => InternalRoute;
}

export interface PluginController extends PluginBase {
    kind: PluginType.controllerDecorator;
    cb: (controller : ControllerDecoratorOpts, proto: ObjectPrototype<ControllerDecoratorOpts>) => ControllerDecoratorOpts;
}

export interface EmConfig {
    threadCount: number; // Number of worker threads
    cleanRequest: (req: Request) => Request; // Function to clean request before sending to worker
    overrideConsole: boolean; // Add color, thread id and log_level
    plugins: (PluginBase)[]; // Computed list of loaded plugins
    debug: boolean; // Enable logging of loaded plugins and controllers for each thread
    verbose: boolean; // Enable status messages of Parent & Child threads
    restartThreads: boolean; // Restart a child if a crash occur
    tsconfigPath: string; // Specify tsconfig.json path
    awaitable?: Promise<void>; // Awaitable promise to resolve before starting parent & child threads
    dispatcher: typeof DispatcherType[keyof typeof DispatcherType]; // Task dispatching strategy
}

export interface BaseConfig extends Partial<Omit<EmConfig, "plugins">> {
    plugins?: string[]; // Load plugin
}

export enum SourceType {
    CONTROLLER = 0,
    GLOBAL_MIDDLEWARE = 1
}

export interface Source {
    path: string;
    type: SourceType;
    args?: Serializable[];
}