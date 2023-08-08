import { Request } from "express";

export function cleanRequest(req: Request) : Request {
    return {
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers,
        path: req.route.path,
        method: req.method
    } as Request;
};