import { Serializable } from '../types';
import { NextFunction, Request, Response } from 'express';
declare class Parent {
    private childs;
    private sources;
    private taskQueue;
    private inc;
    private middlewares;
    constructor(threadCount?: number);
    private newChild;
    run(): Promise<void>;
    private dispatchTask;
    addTask(endpoint: string, req: Request, res: Response, next: NextFunction): void;
    addSource(source: string[]): void;
    addMiddleware(path: string, opts: Serializable[]): void;
    removeMiddleware(opts: Serializable[], path?: string): void;
    close(): void;
    private postChilds;
    get sourcesList(): string[];
}
export declare const Instance: Parent | null;
export default Instance;
