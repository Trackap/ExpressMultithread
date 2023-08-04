import { RouteMethod, Middleware } from "../../types";
export declare function route(method: RouteMethod, path: string, ...middlewares: Middleware[]): (target: any, propertyKey: string) => any;
