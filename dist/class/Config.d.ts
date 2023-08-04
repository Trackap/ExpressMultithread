import { Request } from "express";
declare class Config {
    private _cleanRequest;
    private _threadCount;
    get threadCount(): number;
    set threadCount(value: number);
    get cleanRequest(): (req: Request) => Request;
    set setCleanRequest(value: (req: Request) => Request);
}
declare const Instance: Config;
export default Instance;
