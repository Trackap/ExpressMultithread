/* Modules */
import { Request } from "express";
import { cpus } from "os";

/* Functions */
import { cleanRequest as __cleanRequest } from "../functions/cleanRequest";
import { merge } from "../functions/utils/mergeObject";

/* Constants */
import { invalidThreadCount, tsFile } from "../constants/strings";

class Config {
    private _orig: (req: Request) => Request = __cleanRequest;
    private _custom: ((req: Request) => Request) | undefined = undefined;
    private _threadCount: number = process.env.THREAD_COUNT === undefined ? cpus().length : parseInt(process.env.THREAD_COUNT);
    private _ext : string = tsFile;


    public get threadCount() : number {
        return this._threadCount;
    }
    public set threadCount(value : number) {
        this._threadCount = value;
    }

    public get cleanRequest() : (req: Request) => Request {
        if (this._custom) {
            return (req : Request) => merge(this._custom!(req), this._orig(req));
        }
        return this._orig;
    };

    public set cleanRequest(value: ((req: Request) => Request) | undefined) {
        this._custom = value;
    };

    public get ext(): string {
        return this._ext;
    };

    public set ext(value: ".ts" | ".js") {
        this._ext = value;
    }
};

const Instance = new Config();
if (isNaN(Instance.threadCount) || Instance.threadCount < 0)
    throw new Error(invalidThreadCount);

export default Instance;