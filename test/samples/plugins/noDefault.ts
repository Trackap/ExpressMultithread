import Plugin from "../../../src/class/Plugin";
import  { PluginType, PluginController, ControllerDecoratorOpts, ObjectPrototype } from "../../../src/types";

export class NoDefault extends Plugin implements PluginController {
    public kind : PluginType.controllerDecorator = PluginType.controllerDecorator;

    public cb(opts: ControllerDecoratorOpts, _proto: ObjectPrototype<ControllerDecoratorOpts>) : ControllerDecoratorOpts {
        return opts;
    };
};
