/* Types */
import { RouteMethod, Middleware } from "../../types";

/* Constants */
import {__route, get, keywordUse, set} from "../../constants/strings";

export function route(method: RouteMethod, path: string, ...middlewares: Middleware[]) {
    return (target: any, propertyKey: string) => {
        if (propertyKey === get || propertyKey === set)
            throw new Error(keywordUse);
        Object.defineProperty(target, propertyKey + __route, {value: {method, path, middlewares, cb: target[propertyKey]}});
        return target;
    };
};