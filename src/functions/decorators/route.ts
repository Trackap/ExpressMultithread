/* Types */
import { RouteMethod, Middleware } from "../../types";

/* Constants */
import { __route } from "../../constants/strings";

export function route(method: RouteMethod, path: string, ...middlewares: Middleware[]) {
    return (target: any, propertyKey: string) => {
        Object.defineProperty(target, propertyKey + __route, {value: {method, path, middlewares, cb: target[propertyKey]}});
        return target;
    }
}