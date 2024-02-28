import { Request, Response, NextFunction } from "express";
import { route, controller } from "../../../src/decorators";

const errorMiddleware = (_req: Request, _res: Response, next: NextFunction) => {
    throw new Error("I'm a crash in a middleware");
}

@controller()
class ErrorController  {
    @route("get", "/error")
    public async error(_req: Request, res: Response) {
        throw new Error("I'm a crash");
    }

    @route("get", "/error_mid", errorMiddleware)
    public async error_mid(_req: Request, res: Response) {
        res.status(400).send("Should crash before, with the middleware");
    }
}

export default ErrorController;