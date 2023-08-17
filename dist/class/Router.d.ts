import { Router as ExpressRouter } from 'express';
import { Serializable } from '../types';
export declare class MultithreadedRouter {
    protected _router: ExpressRouter;
    importControllers(path?: string | string[]): void;
    use(middleware: string, ...args: Serializable[]): void;
    unuse(middleware?: string, ...args: Serializable[]): void;
    get router(): ExpressRouter;
}
export declare const Multithreaded: MultithreadedRouter;
export default Multithreaded;
