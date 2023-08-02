/* Functions */
import { toArray } from "./utils/toArray";
import { walk } from "./utils/walk";
import { importModule } from "./utils/importModule";

/* Types */
import { ControllerDecoratorOpts, InternalRoute } from "../types";

/* Constants */
import { __route, defaultStr, empty } from "../constants/strings";

function exploreController(module : any) : Record<string, InternalRoute> | undefined {
    /* Get controller properties */
    const controller = Object.getOwnPropertyDescriptors(module)?.__controller?.value as ControllerDecoratorOpts | undefined;
    if (!controller) return undefined;
    const routes : Record<string, InternalRoute> = {};
    const methods = Object.getOwnPropertyDescriptors(module.prototype);
    const keys = Object.keys(methods);
    /* Loop on keys */
    for (let i = 0; i < keys.length; i++) {
        /* Skip if key is not a route */
        if (!keys[i].endsWith(__route)) continue;
        /* Register route with corresponding middlewares */
        const route = methods[keys[i]].value as InternalRoute;
        /* Full endpoint path */
        const endpoint = (controller.path ?? empty) + route.path;
        const controllerMid = toArray(controller.middlewares ?? []);
        /* Merge all calls */
        const callstack = [...controllerMid, ...route.middlewares, route.cb]; // TODO HANDLE WRAPPER & THREADS_COUNT
        /* Register route */
        routes[endpoint] = {
            ...route,
            callstack
        };
    }
    return routes;
}

export function pathToRoute(path: string | string[]) : Record<string, InternalRoute> {
    const res : Record<string, InternalRoute> = {};
    path = toArray(path);
    /* Loop on paths */
    for (let i = 0; i < path.length; i++) {
        const files = walk(path[i]);
        /* Loop on files */
        for (let j = 0; j < files.length; j++) {
            /* Import module */
            const module = importModule(files[j]);
            const k = Object.keys(module);
            /* Loop on exported keys */
            for (let l = 0; l < k.length; l++) {
                /* Avoid packed export if it's already default one */
                if (k[l] !== defaultStr && module[k[l]] === module.default) continue;
                /* Assign routes finded to res */
                Object.assign(res, exploreController(module[k[l]]) ?? {});
            }
        }
    }
    return res;
}