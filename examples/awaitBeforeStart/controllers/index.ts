import { route, controller } from "../../../src/decorators";
import { Request, Response } from "express";

@controller()
export class SimpleController{
    @route("get", "/")
    public async index(req: Request, res: Response){
        res.status(200).send("Should be accessible after 5 seconds");
    }
}