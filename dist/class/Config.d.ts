import { Request } from "express";
declare class Config {
    private _orig;
    private _custom;
    private _threadCount;
    private _ext;
    get threadCount(): number;
    set threadCount(value: number);
    get cleanRequest(): (req: Request) => Request;
    set cleanRequest(value: ((req: Request) => Request) | undefined);
    get ext(): string;
    set ext(value: ".ts" | ".js");
}
declare const Instance: Config;
export default Instance;
