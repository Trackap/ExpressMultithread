/* Modules */
import { workerData, parentPort, isMainThread } from "worker_threads";
import { register } from 'ts-node';

/* Functions */
import { override } from "../functions/overrideConsole";
import { pathToRoute } from "../functions/pathToRoute";
import { callLoop } from "../functions/callLoop";
import { overrideRes } from "../functions/overrideRes";
import { postParent } from "../functions/utils/postMessage";

/* Types */
import { ParentCmd, ChildCmd, InternalRoute, Serializable, Middleware, SerializedMiddleware } from "../types";
import { Request } from "express";

/* Constants */
import { fnStr, message, nl, noExport, noMain, noParentPort, routeNotFound, unknownCmd } from "../constants/strings";
import { importModule } from "../functions/utils/importModule";

/* Register ts-node if were're in compiled version */
__filename.endsWith(".js") && register();

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
    /* Global middlewares */
    private middlewares : Middleware[] = [];

    constructor() {
        /* Set id */
        this.id = workerData.id;
        /* No parent port = throw */
        if (!parentPort)
            throw new Error(noParentPort);
        /* Override console to be able to identify child */
        override(this.id);
        /* Init child */
        this.initChild();
    };

    private initChild() : void {
        /* Handle messages */
        parentPort!.on(message, async (data: string) => {
            /* Deserialize data */
            const parsed = JSON.parse(data);
            switch (parsed.cmd) {
                case ParentCmd.addSource:
                    this.addSource(parsed.source);
                    break;
                case ParentCmd.addMiddleware:
                    this.setMiddlewares(parsed.middlewares);
                    break;
                case ParentCmd.request:
                    this.handleRequest(parsed.req, parsed.id);
                    break;
                default:
                    throw new Error(unknownCmd);
            }
        });
        /* Send ready message */
        postParent({
            cmd: ChildCmd.ready,
            id: this.id
        });
        console.info("ready");
    };

    private async handleRequest(req: Request, _id: string) : Promise<void> {
        /* Get internal route name */
        const k = req.method.toLowerCase() + req.path;
        if (!this.routes[k])
            throw new Error(routeNotFound);
        /* Loop through callstack */
        callLoop(req, overrideRes(this.id, _id), this.middlewares.concat(this.routes[k].callstack!))
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

    private addSource(source: string[]) : void {
        /* Merge new routes with old one */
        Object.assign(this.routes, pathToRoute(source));
    };

    private setMiddlewares(newMiddlewares : SerializedMiddleware[]) : void {
        this.middlewares = [];
        for (let i = 0; i < newMiddlewares.length; i++) {
            const { path, opts } = newMiddlewares[i];
            const module = importModule(path);
            const cb = module.default;
            if (!cb || typeof cb !== fnStr)
                throw new Error(noExport + path);
            this.middlewares.push(opts && opts.length ? cb(...opts) : cb);
        }
    };
};

if (isMainThread)
    throw new Error(noMain)
const child = new Child();