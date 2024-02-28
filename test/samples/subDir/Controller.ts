import { Request, Response } from 'express';
import { controller, route } from '../../../src/decorators';

@controller()
export class Controller {
    @route("get", "/")
    public getter(_req: Request, res: Response) {
        res.status(200).send("Hello World!");
    }

    @route("get", "/crash")
    public crasher(_req: Request, _res: Response) {
        throw new Error("Crashing");
    }

    @route("post", "/")
    public post(_req: Request, res: Response) {
        res.status(201).send("Hi!");
    }

    @route("put", "/")
    public put(_req: Request, _res: Response) {
        return "Hello";
    }

    @route("delete", "/")
    public delete(_req: Request, _res: Response) {
        return "Hello";
    }

    @route("patch", "/")
    public patch(_req: Request, _res: Response) {
        return "Hello";
    }

    @route("options", "/")
    public options(_req: Request, _res: Response) {
        return "Hello";
    }

    @route("head", "/")
    public head(_req: Request, _res: Response) {
        return "Hello";
    }
}