/* Functions */
import { toArray } from "../../functions/utils/toArray";

/* Types */
import { ControllerDecoratorOpts } from "../../types";

/* Constants */
import { __controller } from "../../constants/strings";

export function controller(opts?: ControllerDecoratorOpts) {
    opts = opts || {
        middlewares: []
    };
    opts?.middlewares && (opts.middlewares = toArray(opts!.middlewares));
    
    return <T extends { new (...args: any[]): {} }>(target: T) => {
        Object.defineProperty(target, __controller, {value: opts});
        return target;
    };
};