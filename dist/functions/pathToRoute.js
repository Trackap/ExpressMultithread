"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathToRoute = void 0;
const toArray_1 = require("./utils/toArray");
const walk_1 = require("./utils/walk");
const importModule_1 = require("./utils/importModule");
const strings_1 = require("../constants/strings");
function exploreController(module) {
    const controller = Object.getOwnPropertyDescriptors(module)?.__controller?.value;
    if (!controller)
        return undefined;
    const routes = {};
    const methods = Object.getOwnPropertyDescriptors(module.prototype);
    const keys = Object.keys(methods);
    for (let i = 0; i < keys.length; i++) {
        if (!keys[i].endsWith(strings_1.__route))
            continue;
        const route = methods[keys[i]].value;
        const endpoint = (controller.path ?? strings_1.empty) + route.path;
        const controllerMid = (0, toArray_1.toArray)(controller.middlewares ?? []);
        const callstack = [...controllerMid, ...route.middlewares, route.cb];
        routes[route.method + endpoint] = {
            ...route,
            callstack,
            endpoint
        };
    }
    return routes;
}
function pathToRoute(path) {
    const res = {};
    path = (0, toArray_1.toArray)(path);
    for (let i = 0; i < path.length; i++) {
        const files = (0, walk_1.walk)(path[i]);
        for (let j = 0; j < files.length; j++) {
            const module = (0, importModule_1.importModule)(files[j]);
            const k = Object.keys(module);
            for (let l = 0; l < k.length; l++) {
                if (k[l] !== strings_1.defaultStr && module[k[l]] === module.default)
                    continue;
                Object.assign(res, exploreController(module[k[l]]) ?? {});
            }
        }
    }
    return res;
}
exports.pathToRoute = pathToRoute;
//# sourceMappingURL=pathToRoute.js.map