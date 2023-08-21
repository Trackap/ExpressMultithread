import { Request, Response } from "express";
import { route, controller } from "../../../src/decorators";
import { protect } from "../../pluginExample/plugin/testPlugin";
import { replace } from "../plugin/replacePlugin";

/* Define a controller */
@protect()
@controller()
class ExampleController {
    /* Define a route */
    @route("get", "/test") // Test will return 401 except you pass APIKEY=TEST in your query params
    public async test(_req: Request, res: Response) {
        res.status(200).send("It's a test!");
    };

};

@controller()
class AnotherController {
    @replace("/world")
    @route("get", "/hello")// Hello path will be replaced by /world with replace plugin
    public async hello(_req: Request, res: Response) {
        res.status(200).send("Hello world!");
    };
};

export { ExampleController, AnotherController };