import { Request, Response, NextFunction } from "express";
import { route, controller } from "../../../src/decorators";

/* Middleware which throw an error */
const errorMiddleware = (_req: Request, _res: Response, next: NextFunction) => {
    console.info("I'm a error middleware, I run on child thread !");
    next(new Error("I'm an error"));
};

@controller()
class ErrorController {
    /* Works with single middleware */
    @route("get", "/error", errorMiddleware)
    public async error(_req: Request, res: Response) {
        res.status(201).send("I'm running on child thread !");
    };

    @route("get", "/crash")
    public async crash(_req: Request, _res: Response) {
        throw new Error("I'm a crash");
    }

    @route("get", "/handled")
    public async handled(_req: Request, _res: Response) {
        throw {
            status: 400,
            message: "I'm a handled error"
        }
    }
}


/* Export controllers, will use one time each one */
export default ErrorController;