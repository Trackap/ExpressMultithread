/* Modules */
import { Router as ExpressRouter } from 'express';

/* Classes */
import Config from './Config';
import Parent from './Parent';

/* Functions */
import { pathToRoute } from '../functions/pathToRoute';
import { toArray } from '../functions/utils/toArray';

/* Types */
import { InternalRoute, Serializable } from '../types';

/* Constants */
import { __route } from '../constants/strings';
import { wrapRequest } from '../functions/wrap';
const defaultPath = process.cwd();

export class MultithreadedRouter {
    /* Express Router */
    protected _router : ExpressRouter = ExpressRouter();

    /* Import new controllers */
    public importControllers(path: string | string[] = defaultPath) : void {
        Parent!.addSource(toArray(path));
        const routes : Record<string, InternalRoute> = pathToRoute(path);
        const endpoints = Object.keys(routes);
        for (let i = 0; i < endpoints.length; i++) {
            const route = routes[endpoints[i]];
            /* Wrap route if needed */
            const callstack = Config.threadCount > 0 ? [wrapRequest(endpoints[i])] : route.callstack!;
            /* Register route on Express Router */
            this._router[route.method](route.endpoint!, ...callstack);
        }
    };

    /* Use a global middleware */
    public use(path: string, ...args: Serializable[]): void {
        Parent!.addMiddleware(path, args);
    };

    /* Unuse a global middleware */
    public unuse(path?: string, ...args: Serializable[]) : void {
        Parent!.removeMiddleware(args, path);
    };

    /*  Getters */
    public get router() : ExpressRouter {
        return this._router;
    };
};

export const Multithreaded = new MultithreadedRouter();
export default Multithreaded;