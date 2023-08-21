import Plugin from "../../../src/class/Plugin";
import  { PluginType, PluginController, ControllerDecoratorOpts, ObjectPrototype } from "../../../src/types";

export default class NoDefault extends Plugin implements PluginController {
    public kind : PluginType.controllerDecorator = PluginType.controllerDecorator;

    public test : boolean = true;

    public cb(_opts: ControllerDecoratorOpts, _proto: ObjectPrototype<ControllerDecoratorOpts>) {
    };
};
