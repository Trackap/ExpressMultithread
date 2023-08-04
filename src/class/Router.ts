/* Modules */
import { Router as ExpressRouter } from 'express';

/* Classes */
import Config from './Config';
import Parent from './Parent';

/* Functions */
import { pathToRoute } from '../functions/pathToRoute';
import { toArray } from '../functions/utils/toArray';

/* Types */
import { InternalRoute, Middleware } from '../types';

/* Constants */
import { __route } from '../constants/strings';
import { wrapRequest } from '../functions/wrap';
const defaultPath = process.cwd();

export class MultithreadedRouter {
    /* List of all routes */
    public routes: Record<string, InternalRoute> = {};
    /* Sources of imports for thread workers */
    protected sources: string[] = [];
    /* Middlewares */
    protected middlewares: Middleware[] = [];
    /* Express Router */
    protected _router : ExpressRouter = ExpressRouter();

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

    /*  Getters */
    public get _sources() : string[] {
        return this.sources;
    };
    public get router() : ExpressRouter {
        return this._router;
    };
};

export const Multithreaded = new MultithreadedRouter();
export default Multithreaded;