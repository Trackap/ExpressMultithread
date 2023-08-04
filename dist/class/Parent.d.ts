import { NextFunction, Request, Response } from 'express';
declare class Parent {
    private childs;
    private taskQueue;
    private inc;
    constructor(threadCount?: number);
    private newChild;
    run(): Promise<void>;
    private dispatchTask;
    addTask(endpoint: string, req: Request, res: Response, next: NextFunction): void;
    addSource(source: string[]): void;
}
declare const Instance: Parent | null;
export default Instance;
