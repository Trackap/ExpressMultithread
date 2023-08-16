import { Request, Response, NextFunction } from "express";

export default function exampleMiddleware(header: string) {
    return (_req: Request, res: Response, next: NextFunction) => {
        res.set("X-Example-Header", header);
        next();
    }
}