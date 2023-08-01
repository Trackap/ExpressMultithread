/* Modules */
import { Router as ExpressRouter } from 'express';

/* Functions */
import { __route, empty, redefinition, defaultStr } from '../constants/strings';
import { walk } from '../functions/utils/walk';
import { importModule } from '../functions/utils/importModule';
import { toArray } from '../functions/utils/toArray';

/* Types */
import { ControllerDecoratorOpts, InternalRoute, Middleware } from '../types';

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

    constructor() {
    }

    protected registerRoute(opts: ControllerDecoratorOpts, route: InternalRoute) : void {
        /* Get complete name */
        const fullPath = (opts.path ?? empty) + route.path;
        /* Check if routes are already defined */
        this.routes[fullPath] ? console.error(redefinition + fullPath) : this.routes[fullPath] = route;
        /* Merge all middlewares */
        const controllerMid = opts.middlewares ?? [];
        const middlewares = [...this.middlewares, ...toArray(controllerMid), ...route.middlewares];
        /* Express stuff */
        middlewares.push(route.cb);
        this._router[route.method](fullPath, ...middlewares);
    }

    protected registerController(module: any) : void {
        /* Get controller properties */
        const controller = Object.getOwnPropertyDescriptors(module)?.__controller?.value;
        if (!controller) return;
        /* Get routes */
        const routes = Object.getOwnPropertyDescriptors(module.prototype);
        const keys = Object.keys(routes);
        /* Loop on keys */
        for (let i = 0; i < keys.length; i++) {
            /* Skip if key is not a route */
            if (!keys[i].endsWith(__route)) continue;
            /* Register route with corresponding middlewares */
            this.registerRoute(controller, routes[keys[i]].value);
        }
    };

    public importControllers(path: string | string[] = defaultPath) : void {
        path = toArray(path);
        this.sources = this.sources.concat(path);
        /* Loop on paths */
        for (let i = 0; i < path.length; i++) {
            const files = walk(path[i]);
            /* Loop on files */
            for (let j = 0; j < files.length; j++) {
                /* Import file */
                const module = importModule(files[j]);
                const k = Object.keys(module);
                /* Loop on exported methods */
                for (let l = 0; l < k.length; l++) {
                    /* Skip if method is exported twice (with default) */
                    if (k[l] !== defaultStr && module[k[l]] === module.default) continue;
                    this.registerController(module[k[l]]);
                }
            }
        }
    };

    public use(middleware: Middleware | Middleware[]) : void {
        this.middlewares = this.middlewares.concat(toArray(middleware));
    };

    public set(middleware: Middleware | Middleware[]) : void {
        this.middlewares = toArray(middleware);
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