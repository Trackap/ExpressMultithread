import { ControllerDecoratorOpts } from "../../types";
export declare function controller(opts?: ControllerDecoratorOpts): <T extends new (...args: any[]) => {}>(target: T) => T;
