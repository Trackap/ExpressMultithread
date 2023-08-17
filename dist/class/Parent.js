"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Instance = void 0;
const worker_threads_1 = require("worker_threads");
const crypto_1 = require("crypto");
const Config_1 = __importDefault(require("./Config"));
const sleep_1 = require("../functions/utils/sleep");
const types_1 = require("../types");
const strings_1 = require("../constants/strings");
const postMessage_1 = require("../functions/utils/postMessage");
const compareArray_1 = require("../functions/utils/compareArray");
class Parent {
    constructor(threadCount = Config_1.default.threadCount) {
        this.childs = [];
        this.sources = [];
        this.taskQueue = [];
        this.inc = 0;
        this.middlewares = [];
        for (let i = 0; i < threadCount; i++) {
            this.newChild();
        }
    }
    ;
    newChild() {
        this.inc++;
        const child = new worker_threads_1.Worker(__dirname + strings_1.slash + strings_1.childFile, {
            workerData: {
                id: this.inc
            }
        });
        child.on(strings_1.message, (data) => {
            const parsed = JSON.parse(data);
            const i = this.childs.find((child) => child.id === parsed.id);
            if (!i)
                throw new Error(strings_1.childNotFound);
            switch (parsed.cmd) {
                case types_1.ChildCmd.ready:
                    i.ready = true;
                    break;
                case types_1.ChildCmd.response:
                    let res = i.tasks.find((t) => t.id === parsed.tid)?.res;
                    res && res[parsed.call](...parsed.args);
                    break;
                case types_1.ChildCmd.next:
                    let index = i.tasks.findIndex((t) => t.id === parsed.tid);
                    index !== -1 && i.tasks.splice(index, 1).at(0)?.next(parsed.arg);
                    break;
                default:
                    throw new Error(strings_1.unknownCmd);
            }
        });
        child.on(strings_1.error, (e) => {
            throw e;
        });
        (0, postMessage_1.postChild)(child, {
            cmd: types_1.ParentCmd.addSource,
            source: this.sources
        });
        this.childs.push({
            id: this.inc,
            instance: child,
            tasks: [],
            ready: false
        });
    }
    ;
    async run() {
        while (true) {
            await (0, sleep_1.sleep)(1);
            this.taskQueue.length && this.dispatchTask();
        }
    }
    ;
    dispatchTask() {
        const occupation = [];
        for (let i = 0; i < this.childs.length; i++) {
            const child = this.childs[i];
            child.ready ? occupation.push(child.tasks.length) : occupation.push(Infinity);
        }
        while (this.taskQueue.length) {
            const min = Math.min(...occupation);
            if (min === Infinity)
                break;
            const i = occupation.indexOf(min);
            const task = this.taskQueue.shift();
            this.childs[i].tasks.push(task);
            occupation[i]++;
            (0, postMessage_1.postChild)(this.childs[i].instance, {
                cmd: types_1.ParentCmd.request,
                req: Config_1.default.cleanRequest(task.req),
                id: task.id
            });
        }
    }
    ;
    addTask(endpoint, req, res, next) {
        this.taskQueue.push({
            endpoint,
            req,
            res,
            next,
            id: (0, crypto_1.randomUUID)()
        });
    }
    ;
    addSource(source) {
        this.sources.push(...source);
        this.postChilds(types_1.ParentCmd.addSource, {
            cmd: types_1.ParentCmd.addSource,
            source
        });
    }
    ;
    addMiddleware(path, opts) {
        this.middlewares.push({
            path,
            opts
        });
        this.postChilds(types_1.ParentCmd.addMiddleware, {
            middlewares: this.middlewares
        });
    }
    ;
    removeMiddleware(opts, path) {
        if (!path) {
            this.middlewares = [];
        }
        else {
            for (let i = 0; i < this.middlewares.length; i++) {
                let m = this.middlewares[i];
                if (m.path === path && (0, compareArray_1.compareArray)(m.opts, opts)) {
                    this.middlewares.splice(i, 1);
                    continue;
                }
            }
        }
        this.postChilds(types_1.ParentCmd.addMiddleware, {
            middlewares: this.middlewares
        });
    }
    ;
    close() {
        for (let i = 0; i < this.childs.length; i++) {
            this.childs[i].instance.terminate();
        }
    }
    ;
    postChilds(cmd, data) {
        data.cmd = cmd;
        for (let i = 0; i < this.childs.length; i++) {
            (0, postMessage_1.postChild)(this.childs[i].instance, data);
        }
    }
    ;
    get sourcesList() {
        return this.sources;
    }
    ;
}
;
exports.Instance = worker_threads_1.isMainThread ? new Parent() : null;
exports.Instance?.run();
exports.default = exports.Instance;
//# sourceMappingURL=Parent.js.map