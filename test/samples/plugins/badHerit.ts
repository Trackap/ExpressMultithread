import  { PluginType, ControllerDecoratorOpts, ObjectPrototype } from "../../../src/types";

export default class badHerit {
    public kind : PluginType.controllerDecorator = PluginType.controllerDecorator;

    public cb(_opts: ControllerDecoratorOpts, _proto: ObjectPrototype<ControllerDecoratorOpts>) {
    };
};
