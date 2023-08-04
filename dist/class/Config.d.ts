import { Request } from "express";
declare class Config {
    private _orig;
    private _custom;
    private _threadCount;
    get threadCount(): number;
    set threadCount(value: number);
    get cleanRequest(): (req: Request) => Request;
    set cleanRequest(value: ((req: Request) => Request) | undefined);
}
declare const Instance: Config;
export default Instance;
