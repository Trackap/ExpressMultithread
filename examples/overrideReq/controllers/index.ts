import { Response } from "express";
import { route, controller } from "../../../src/decorators";
import { RequestWithHello } from "../declaration";

/* Define a controller */
@controller()
class ExampleController {
    /* Define a route */
    @route("get", "/hello")
    public async hello(req: RequestWithHello, res: Response) {
        console.log(req);
        res.status(200).send(req.hello);
    };
};

export { ExampleController };