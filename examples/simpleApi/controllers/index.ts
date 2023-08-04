import { Request, Response } from "express";
import { route, controller } from "../../../src/decorators";

/* Define a controller */
@controller()
class ExampleController {
    /* Define a route */
    @route("get", "/child")
    public async hello(_req: Request, res: Response) {
        console.log("I'm running on child thread !");
        res.status(201).send("I'm running on child thread !");
    };
};

export { ExampleController };