/* Classes */
import Plugin from "../../../src/class/Plugin";

/* Types */
import { InternalRoute, ObjectPrototype, PluginRoute, PluginType } from "../../../src/types";

/* Create a method decorator */
/* Replace take one argument: the path which will be replaced */
export function replace(endpoint: string) {
    /* Evaluate part of the decorator will be executed before the controller decorator */ 
    return (target: any, propertyKey: string) => {
        /* Define a property __replace on the  controller prototype,
        watch out, doesn't not propertyKey or propertyKey__route, theses
        are usefull for the multithreading part */
        Object.defineProperty(target, `${propertyKey}__replace`, {
            value: endpoint
        });
        /* Don't forget to return targets (or another one ^^) */
        return target;
    };
};

export default class ReplacePlugin extends Plugin implements PluginRoute {
    /* Define kind of plugin, here : routeDecorator */
    public kind: PluginType.routeDecorator = PluginType.routeDecorator;

    /* Define the callback which will be executed when the route will be mapped */
    public cb(route: InternalRoute, propertyKey : string, proto: ObjectPrototype<InternalRoute>) {
        const replace = proto[`${propertyKey}__replace`];
        /* The route doesn't have replace decorator */
        if (!replace) return route;
        /* Replace the path by the replace value */
        route.path = replace.value;
        return route;
    }
}