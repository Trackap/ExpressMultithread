/* Modules */
import { workerData, parentPort, isMainThread } from "worker_threads";
import { register } from 'ts-node';

/* Register ts-node if were're in compiled version */
import Config from "../config";
__filename.endsWith(".js") && register(require(Config.tsconfigPath));

/* Functions */
import { override } from "../functions/overrideConsole";
import { pathToRoute } from "../functions/pathToRoute";
import { callLoop } from "../functions/callLoop";
import { overrideRes } from "../functions/overrideRes";
import { postParent } from "../functions/utils/postMessage";
import { importModule } from "../functions/utils/importModule";

/* Types */
import { Callback, ChildCmd, InternalRoute, Middleware, ParentCmd, Serializable, Source, SourceType} from "../types";
import { Request } from "express";

/* Constants */
import {message, noMain, fnStr, nl, routeNotFound } from "../constants/strings";

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

    private async handleRequest(req: Request, _id: string) : Promise<void> {
        /* Get internal route name */
        const k = req.method.toLowerCase() + req.path;
        if (!this.routes[k])
            throw new Error(routeNotFound);
        /* Loop through callstack */
        callLoop(req, overrideRes(this.id, _id), this.routes[k].callstack!)
            /* Handle next() */
            .then((res?: "route" | "router") => {
                switch (res) {
                    case "route":
                        pNext(this.id, _id, res);
                        break;
                    case "router":
                        pNext(this.id, _id, res);
                        break;
                    default:
                        pNext(this.id, _id, undefined);
                        break;
                }
            })
            /* Handle errors */
            .catch((e: Error) => {
                pNext(this.id, _id, e.message + nl + e.stack);
            });
    };

    private setSources(sources: Source[]) {
        let mid : Middleware[] = [];
        this.routes = {}
        for (let i = 0; i < sources.length; i++) {
            const s = sources[i];
            switch (s.type) {
                case SourceType.CONTROLLER:
                    const routes = this.applyMiddleware(s, mid);
                    /* Add new routes to router */
                    Object.assign(this.routes, routes);
                    break;
                case SourceType.GLOBAL_MIDDLEWARE:
                    this.applyHandler(s, mid);
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
            routes[keys[i]].callstack = (mid as (Middleware | Callback)[]).concat(routes[keys[i]].callstack!);
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
        /* Classic middleware */
        if (cb.length === 3) {
            mid.push(cb);
        /* Error Handler middleware */
        } else if (cb.length === 4) {
            const keys = Object.keys(this.routes);
            for (let i = 0; i < keys.length; i++) {
                this.routes[keys[i]].callstack = this.routes[keys[i]].callstack!.concat(cb)
            }
        } else {
            throw new Error(`Exported function is not a correct middleware : ${source.path}`);
        }
        return mid;
    }
}

if (isMainThread)
    throw new Error(noMain)
const child = new Child();