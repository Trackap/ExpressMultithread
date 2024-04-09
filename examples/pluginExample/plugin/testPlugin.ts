/* Classes */
import Plugin from "../../../src/class/Plugin";

/* Functions */
import { toArray } from "../../../src/functions/utils/toArray";

/* Types */
import { Request, Response, NextFunction } from "express";
import { ControllerDecoratorOpts, ObjectPrototype, PluginController, PluginType } from "../../../src/types";

/* Constants */
/* Simple middleware which check APIKEY query param */
const exampleMid = (req: Request, res: Response, next: NextFunction) => req.query["APIKEY"] !== "TEST" ? res.status(401).send("Unauthorized") : next();

/* Define a class decorator */
export function protect() {
    /* Evaluate part of the decorator will be executed before the controller decorator */ 
    return <T extends { new (...args: any[]): {} }>(target: T) => {
        /* Call part of the decorator will be executed after the controller decorator */
        /* Define a property on the controller prototype */
        Object.defineProperty(target, "__protect", {
            value: {
                mid: exampleMid
            }
        });
        /* Don't forget to return the target */
        return target;
    };
};

/* Export as default a class which extends Plugin and implements a Plugin type, here : PluginController */
export default class ProtectPlugin extends Plugin implements PluginController {
    /* Define the kind of plugin, here : controllerDecorator */
    public kind : PluginType.controllerDecorator = PluginType.controllerDecorator;

    /* Define the callback which will be executed when the route will be mapped */
    public cb(controller: ControllerDecoratorOpts, proto : ObjectPrototype<ControllerDecoratorOpts>) {
        /* The controller doesn't have protect decorator */
        if (!proto.__protect) return controller;
        /* The controller doesn't have middlewares property */
        !controller.middlewares && (controller.middlewares = []);
        /* Add the middleware to the controller */
        controller.middlewares = [proto.__protect.value.mid, ...toArray(controller.middlewares)];
        return controller;
    };
};