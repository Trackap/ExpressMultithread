import { Request } from 'express';

declare global {
    namespace Express {
        export interface Request {
            hello: string;
        }
    }
}

export interface RequestWithHello extends Request {
    hello: string;
};