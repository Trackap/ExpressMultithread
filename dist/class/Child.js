"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const ts_node_1 = require("ts-node");
const overrideConsole_1 = require("../functions/overrideConsole");
const pathToRoute_1 = require("../functions/pathToRoute");
const callLoop_1 = require("../functions/callLoop");
const overrideRes_1 = require("../functions/overrideRes");
const postMessage_1 = require("../functions/utils/postMessage");
const types_1 = require("../types");
const strings_1 = require("../constants/strings");
const importModule_1 = require("../functions/utils/importModule");
__filename.endsWith(".js") && (0, ts_node_1.register)();
const pNext = function (id, tid, arg) {
    (0, postMessage_1.postParent)({
        cmd: types_1.ChildCmd.next,
        id,
        tid,
        arg
    });
};
class Child {
    constructor() {
        this.routes = {};
        this.middlewares = [];
        this.id = worker_threads_1.workerData.id;
        if (!worker_threads_1.parentPort)
            throw new Error(strings_1.noParentPort);
        (0, overrideConsole_1.override)(this.id);
        this.initChild();
    }
    ;
    initChild() {
        worker_threads_1.parentPort.on(strings_1.message, async (data) => {
            const parsed = JSON.parse(data);
            switch (parsed.cmd) {
                case types_1.ParentCmd.addSource:
                    this.addSource(parsed.source);
                    break;
                case types_1.ParentCmd.addMiddleware:
                    this.setMiddlewares(parsed.middlewares);
                    break;
                case types_1.ParentCmd.request:
                    this.handleRequest(parsed.req, parsed.id);
                    break;
                default:
                    throw new Error(strings_1.unknownCmd);
            }
        });
        (0, postMessage_1.postParent)({
            cmd: types_1.ChildCmd.ready,
            id: this.id
        });
        console.info("ready");
    }
    ;
    async handleRequest(req, _id) {
        const k = req.method.toLowerCase() + req.path;
        if (!this.routes[k])
            throw new Error(strings_1.routeNotFound);
        (0, callLoop_1.callLoop)(req, (0, overrideRes_1.overrideRes)(this.id, _id), this.middlewares.concat(this.routes[k].callstack))
            .then((res) => {
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
            .catch((e) => {
            pNext(this.id, _id, e.message + strings_1.nl + e.stack);
        });
    }
    ;
    addSource(source) {
        Object.assign(this.routes, (0, pathToRoute_1.pathToRoute)(source));
    }
    ;
    setMiddlewares(newMiddlewares) {
        this.middlewares = [];
        for (let i = 0; i < newMiddlewares.length; i++) {
            const { path, opts } = newMiddlewares[i];
            const module = (0, importModule_1.importModule)(path);
            const cb = module.default;
            if (!cb || typeof cb !== strings_1.fnStr)
                throw new Error(strings_1.noExport + path);
            this.middlewares.push(opts && opts.length ? cb(...opts) : cb);
        }
    }
    ;
}
;
if (worker_threads_1.isMainThread)
    throw new Error(strings_1.noMain);
const child = new Child();
//# sourceMappingURL=Child.js.map