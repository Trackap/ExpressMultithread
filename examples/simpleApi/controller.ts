import { Request, Response } from "express";
import { route, controller } from "../../src/decorators";

@controller({
    path: "/v2",
    middlewares: (_req, _res, next) => {next(), console.log("Controller mid")}
})
class Index {
    @route("get", "/", (_req, _res, next) => {next(), console.log("Route mid")})
    public async hello(req: Request, res: Response) {
        res.send("Hello World! " + req.query.name);
    }

    @route("post", "/profile")
    public async profile(req: Request, res: Response) {
        res.send("Profile of " + req.params.name);
    }
}



export { Index };