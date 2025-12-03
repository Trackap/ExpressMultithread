/* Multithreaded Router */
import { Multithreaded } from './class/Router';
export { Multithreaded };

/* Route & controller decorators */
export * from "./decorators";

/* Plugin class */
export * from "./class/Plugin";

/* Constants */
export {
    DispatcherType
} from "./constants/strings";

/* Types */
export type {
    BaseConfig,
    InternalRoute,
    ControllerDecoratorOpts,
    ObjectPrototype,
    PluginRoute,
    PluginType,
    PluginController,
} from "./types";

export default Multithreaded;