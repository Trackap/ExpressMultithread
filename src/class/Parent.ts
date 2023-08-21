/* Modules */
import { Worker, isMainThread } from 'worker_threads';
import { randomUUID } from 'crypto';

/* Functions */
import { sleep } from '../functions/utils/sleep';

/* Types */
import { ChildData, Task, ParentCmd, ChildCmd, Serializable, SerializedMiddleware } from '../types';
import { NextFunction, Request, Response } from 'express';

/* Constants */
import Config from '../config';
import { childFile, childNotFound, error, message, slash, unknownCmd } from '../constants/strings';
import { postChild } from '../functions/utils/postMessage';
import { compareArray } from '../functions/utils/compareArray';

class Parent {
    /* List of all childs */
    private childs: ChildData[] = [];
    /* Sources of imports for thread workers */
    private sources: string[] = [];
    /* List of unassigned tasks */
    private taskQueue: Task[] = [];
    /* Incremental id for childs */
    private inc : number = 0;
    /* Global Middlewares */
    private _middlewares : SerializedMiddleware[] = [];

    constructor(threadCount : number = Config.threadCount) {
        /* Create X childs */
        for (let i = 0; i < threadCount; i++) {
            this.newChild();
        }
    };

    private newChild() : void {
        this.inc++;
        /* Create child */
        const child = new Worker(__dirname + slash + childFile, {
            workerData: {
                id: this.inc
            }
        });
        /* Handle child messages */
        child.on(message, (data : string) => {
            /* Deserialize data */
            const parsed = JSON.parse(data);
            /* Get child */
            const i = this.childs.find((child) => child.id === parsed.id);
            if (!i) throw new Error(childNotFound);
            /* Handle cmds */
            switch (parsed.cmd) {
                case ChildCmd.ready: 
                    /* set child as ready */
                    i.ready = true;
                    break;
                case ChildCmd.response:
                    /* Get response */
                    let res = i.tasks.find((t) => t.id === parsed.tid)?.res;
                    /* Send response */
                    res && (res as any)[parsed.call](...parsed.args);
                    break;
                case ChildCmd.next:
                    /* Get task index */
                    let index = i.tasks.findIndex((t) => t.id === parsed.tid);
                    /* Remove task && get next */
                    let next = (index !== -1 && i.tasks.splice(index, 1).at(0)?.next);
                    /* Call next if args are provided */
                    parsed.arg !== undefined && next && next(parsed.arg);
                    break;
                default:
                    throw new Error(unknownCmd);
            }
        });
        /* Handle child errors */
        child.on(error, (e: Error) => {
            throw e;
        });
        /* Update child sources */
        postChild(child, {
            cmd: ParentCmd.addSource,
            source: this.sources
        });
        /* Update child middlewares */
        postChild(child, {
            cmd: ParentCmd.addMiddleware,
            middlewares: this.middlewares
        });
        /* Save child */
        this.childs.push({
            id: this.inc,
            instance: child,
            tasks: [],
            ready: false
        });
    };

    public async run() : Promise<void> {
        /* Loop infinitly and dispatch tasks if there is any */
        while (true) {
            await sleep(1);
            this.taskQueue.length && this.dispatchTask();
        }
    };

    private dispatchTask() : void {
        const occupation : number[] = [];
        /* Get occupation of each child */
        for (let i = 0; i < this.childs.length; i++) {
            const child = this.childs[i];
            child.ready ? occupation.push(child.tasks.length) : occupation.push(Infinity);
        }
        /* Dispatch task queue */
        while (this.taskQueue.length) {
            const min = Math.min(...occupation);
            /* Avoid send to busy childs */
            if (min === Infinity)
                break;
            /* Get index of child less used */
            const i = occupation.indexOf(min);
            /* Move task from queue to child tasks */
            const task = this.taskQueue.shift()!;
            this.childs[i].tasks.push(task);
            /* Increase occupation score */
            occupation[i]++;
            /* Send task to child */
            postChild(this.childs[i].instance, {
                cmd: ParentCmd.request,
                req: Config.cleanRequest(task.req),
                id: task.id
            });
        }
    };

    public addTask(endpoint: string, req: Request, res: Response, next: NextFunction) : void {
        /* Save task */
        this.taskQueue.push({
            endpoint,
            req,
            res,
            next,
            id: randomUUID()
        });
    };

    public addSource(source : string[]) : void {
        /* Add source to sources */
        this.sources.push(...source);
        /* Send new sources to childs */
        this.postChilds(ParentCmd.addSource, {
            cmd: ParentCmd.addSource,
            source
        });
    };

    public addMiddleware(path: string, opts: Serializable[]) : void {
        /* Push in middlewares */
        this.middlewares.push({
            path,
            opts
        });
        /* Update childs */
        this.postChilds(ParentCmd.addMiddleware, {
            middlewares: this.middlewares
        });
    };

    public removeMiddleware(opts: Serializable[], path?: string) : void {
        /* Remove all middlewares if no path */
        if (!path) {
            /* Empty array */
            this._middlewares = [];
        } else {
            /* Fetch middleware to remove */
            for (let i = 0; i < this.middlewares.length; i++) {
                let m = this.middlewares[i];
                /* Path match with opts */
                if (m.path === path && compareArray(m.opts, opts)) {
                    /* Remove middleware */
                    this.middlewares.splice(i, 1);
                    continue;
                }
            }
        }
        /* Update childs */
        this.postChilds(ParentCmd.addMiddleware, {
            middlewares: this.middlewares
        });
    };

    /* Close all childs, may cause express trouble */
    public close() : void {
        for (let i = 0; i < this.childs.length; i++) {
            this.childs[i].instance.terminate();
        }
    };

    /* Post message on all childs */
    private postChilds(cmd: ParentCmd, data: any) : void {
        data.cmd = cmd;
        for (let i = 0; i < this.childs.length; i++) {
            postChild(this.childs[i].instance, data);
        }
    };

    /* Getters */
    public get sourcesList() : string[] {
        return this.sources;
    };
    public get middlewares() : SerializedMiddleware[] {
        return this._middlewares;
    };
};

export const Instance = isMainThread ? new Parent() : null;
Instance?.run();

export default Instance;