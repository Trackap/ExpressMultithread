import { Router as ExpressRouter } from 'express';
import { InternalRoute, Middleware } from '../types';
export declare class MultithreadedRouter {
    routes: Record<string, InternalRoute>;
    protected middlewares: Middleware[];
    protected _router: ExpressRouter;
    importControllers(path?: string | string[]): void;
    get router(): ExpressRouter;
}
export declare const Multithreaded: MultithreadedRouter;
export default Multithreaded;
