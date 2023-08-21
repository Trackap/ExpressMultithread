/* Functions */
import { toArray } from "./utils/toArray";
import { walk } from "./utils/walk";
import { importModule } from "./utils/importModule";

/* Types */
import { ControllerDecoratorOpts, InternalRoute, PluginType } from "../types";

/* Constants */
import Config from "../config";
import { __route, defaultStr, empty } from "../constants/strings";

/* Controller plugins */
const ctlPlugins = Config.plugins.filter(p => p.kind === PluginType.controllerDecorator);
/* Route plugins */
const rtPlugins = Config.plugins.filter(p => p.kind === PluginType.routeDecorator);
/* Binding */
const ogopd = (m: any) => Object.getOwnPropertyDescriptors(m);

function exploreController(module : any) : Record<string, InternalRoute> | undefined {
    /* Make sure module is a controller */
    if (!ogopd(module)?.__controller?.value) return undefined;
    /* Get controller properties */
    const controller = ogopd(module).__controller.value as ControllerDecoratorOpts;
    /* Iterate on controller plugins */
    for (let i = 0; i < ctlPlugins.length; i++)
        ctlPlugins[i].cb(controller, ogopd(module));
    const routes : Record<string, InternalRoute> = {};
    const methods = ogopd(module.prototype);
    const keys = Object.keys(methods);
    /* Loop on keys */
    for (let i = 0; i < keys.length; i++) {
        /* Skip if key is not a route */
        if (!keys[i].endsWith(__route)) continue;
        /* Register route with corresponding middlewares */
        const route = methods[keys[i]].value as InternalRoute;
        const propertyKey = keys[i].slice(0, -__route.length);
        /* Iterate on route plugins */
        for (let j = 0; j < rtPlugins.length; j++)
            rtPlugins[j].cb(route, propertyKey, ogopd(module.prototype));
        /* Full endpoint path */
        const endpoint = (controller.path ?? empty) + route.path;
        const controllerMid = toArray(controller.middlewares ?? []);
        /* Merge all calls */
        const callstack = [...controllerMid, ...route.middlewares, route.cb]; // TODO HANDLE WRAPPER & THREADS_COUNT
        /* Register route */
        routes[ route.method +  endpoint] = {
            ...route,
            callstack,
            endpoint
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