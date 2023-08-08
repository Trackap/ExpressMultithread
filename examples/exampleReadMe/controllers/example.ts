import { controller, route } from "../../../src/decorators";
import { Request, Response } from "express";

@controller()
export class ExampleController {
    @route("get", "/hello")
    public hello(_req: Request, res: Response) {
        res.status(200).send("Hello world !");
    }
}