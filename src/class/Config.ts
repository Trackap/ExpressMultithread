/* Modules */
import { Request } from "express";
import { cpus } from "os";

/* Classes */
// import Parent from "./Parent";

/* Functions */
import { cleanRequest as __cleanRequest } from "../functions/cleanRequest";

/* Constants */
import { invalidThreadCount } from "../constants/strings";
// import { isMainThread } from "worker_threads";

class Config {
    private _cleanRequest: (req: Request) => Request = __cleanRequest;
    private _threadCount: number = process.env.THREAD_COUNT === undefined ? cpus().length : parseInt(process.env.THREAD_COUNT);


    public get threadCount() : number {
        return this._threadCount;
    }
    public set threadCount(value : number) {
        this._threadCount = value;
    }

    public get cleanRequest() : (req: Request) => Request {
        return this._cleanRequest;
    };

    public set setCleanRequest(value: (req: Request) => Request) {
        this._cleanRequest = value;
    };
};

const Instance = new Config();
if (isNaN(Instance.threadCount) || Instance.threadCount < 0)
    throw new Error(invalidThreadCount);

export default Instance;