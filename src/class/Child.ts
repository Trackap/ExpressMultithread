/* Modules */
import { workerData, parentPort, isMainThread } from "worker_threads";

/* Priority for ts regisration */
import { registerTS } from "../functions/utils/register";
registerTS();
import Config from "../config";
registerTS(Config.tsconfigPath);

/* Classes */
import { CallLoop } from "../class/CallLoop";

/* Functions */
import { override } from "../functions/overrideConsole";
import { pathToRoute } from "../functions/pathToRoute";
import { overrideRes } from "../functions/overrideRes";
import { postParent } from "../functions/utils/postMessage";
import { importModule } from "../functions/utils/importModule";
import { makeObj } from "../functions/utils/makeObj";

/* Types */
import {
    Layer,
    ChildCmd,
    InternalRoute,
    Middleware,
    ParentCmd,
    Serializable,
    Source,
    SourceType
} from "../types";
import { Request } from "express";

/* Constants */
import {message, noMain, fnStr, routeNotFound, route, router} from "../constants/strings";

const pNext = function (id: number, tid: string, arg: Serializable) : void {
    postParent({
        cmd: ChildCmd.next,
        id,
        tid,
        arg
    });
};

class Child {
    /* Id of child */
    private id : number;
    /* All routes */
    private routes : Record<string, InternalRoute> = {};
    private sources : Source[] = [];

    constructor() {
        /* Set id */
        this.id = workerData.id;
        /* No parent port = throw */
        if (!parentPort)
            throw new Error("No parent port");
        /* Override console to be able to identify child */
        Config.overrideConsole && override(this.id);
        /* Init child */
        this.initChild();
    };

    private initChild() : void {
        /* Handle messages */
        parentPort!.on(message, async (data: string) => {
            /* Deserialize data */
            const parsed = JSON.parse(data);
            switch (parsed.cmd) {
                case ParentCmd.setSource:
                    this.setSources(parsed.source);
                    break;
                case ParentCmd.request:
                    this.handleRequest(parsed.req, parsed.id);
                    break;
                default:
                    throw new Error(`Unknown command : '${parsed.cmd}'`);
            }
        });
        /* Send ready message */
        postParent({
            cmd: ChildCmd.ready,
            id: this.id
        });
        Config.verbose && console.info("Child ready");
    };

    private handleRequest(req: Request, _id: string) {
        /* Get internal route name */
        const k = req.method.toLowerCase() + req.path;
        if (!this.routes[k])
            throw new Error(routeNotFound);
        /* Loop through callstack */
        new CallLoop(req, overrideRes(this.id, _id), this.routes[k].callstack!).handle()
            /* Handle next() */
            .then((res: unknown) => pNext(this.id, _id, res === route || res === router ? res : undefined))
            /* Handle errors */
            .catch((e: Error) => pNext(this.id, _id, makeObj(e, Object.getOwnPropertyNames(e))));
    };

    private setSources(sources: Source[]) {
        let mid : Middleware[] = [];
        this.routes = {};
        this.sources = sources;
        for (let i = 0; i < sources.length; i++) {
            const s = sources[i];
            switch (s.type) {
                case SourceType.CONTROLLER:
                    /* Add new routes to router */
                    Object.assign(this.routes, this.applyMiddleware(s, mid));
                    break;
                case SourceType.GLOBAL_MIDDLEWARE:
                    /* Register new mid or apply new err mid to all declared routes */
                    mid = this.applyHandler(s, mid);
                    break;
                default:
                    throw new Error(`Unknown source: '${sources[i].type}'`)
            }
        }
    };

    private applyMiddleware(source: Source, mid: Middleware[]) {
        const routes = pathToRoute(source.path);
        const keys = Object.keys(routes);
        for (let i = 0; i < keys.length; i++) {
            /* Concat current middlewares with this controller */
            if (this.routes[keys[i]]) {
                console.warn(`Warning : Redefinition of route : ${keys[i]}, will override previous handling.`)
            }
            routes[keys[i]].callstack = (mid as Layer[]).concat(routes[keys[i]].callstack!);
        }
        return routes;
    }

    /* Update all existing route callstack */
    private applyHandler(source: Source, mid : Middleware[]) {
        /* Import middleware */
        let cb = importModule(source.path)?.default;
        /* Bad module */
        if (!cb || typeof cb !== fnStr)
            throw new Error(`No default exported function on path : '${source.path}'`);
        /* Apply args if needed */
        source.args && source.args.length && (cb = cb(...source.args))
        switch (cb.length) {
            /* Classic middleware */
            case 3:
                mid.push(cb);
                break;
            /* Error Handler middleware */
            case 4:
                const keys = Object.keys(this.routes);
                for (let i = 0; i < keys.length; i++) {
                    this.routes[keys[i]].callstack = this.routes[keys[i]].callstack!.concat(cb)
                }
                break;
            default:
                throw new Error(`Exported function is not a correct middleware : ${source.path}`);
        }
        return mid;
    }

    public get _routes() : Record<string, InternalRoute> {
        return this.routes;
    }

    public get _sources() : Source[] {
        return this.sources;
    }
}

if (isMainThread)
    throw new Error(noMain)
export const child = new Child();