import { Request, Response, NextFunction } from "express";

export default function errorHandling(err: any, _req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
        console.warn(err)
        return next();
    } else {
        res.status(200).send("An error occured but was handled!")
        return next();
    }
}