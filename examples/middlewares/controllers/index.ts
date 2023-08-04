import { Request, Response, NextFunction } from "express";
import { route, controller } from "../../../src/decorators";

/* Simple middleware */
const exampleMiddleware = (_req: Request, _res: Response, next: NextFunction) => {
    console.info("I'm a middleware, I run on child thread !");
    next();
};

/* Middleware which throw an error */
const errorMiddleware = (_req: Request, _res: Response, next: NextFunction) => {
    console.info("I'm a error middleware, I run on child thread !");
    next(new Error("I'm an error"));
};

@controller({
    path: "/prefix", // Prefix all routes in this controller with /prefix
    middlewares: // Add middlewares to all routes in this controller (can be a single middleware or an array of middlewares)
        exampleMiddleware
})
class ExampleController {
    @route("get", "/child", exampleMiddleware, exampleMiddleware )
    // Add middlewares to this route (can be a single middleware or an array of middlewares
    public async child(_req: Request, res: Response) {
        res.status(201).send("I'm running on child thread !");
    };

    @route("get", "/child2", exampleMiddleware)
    public async child2(_req: Request, res: Response) {
        res.status(201).send("I'm running on child thread !");
    }
};

@controller({
    /* Works with array */
    middlewares: [ exampleMiddleware, errorMiddleware, exampleMiddleware ]
})
class ErrorController {
    /* Works with single middleware */
    @route("get", "/error", exampleMiddleware)
    public async error(_req: Request, res: Response) {
        res.status(201).send("I'm running on child thread !");
    };
}


/* Export controllers, will use one time each one */
export { ExampleController, ErrorController };
export default ExampleController;