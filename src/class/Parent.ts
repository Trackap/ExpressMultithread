/* Modules */
import { Worker, isMainThread } from 'worker_threads';
import { randomUUID } from 'crypto';

/* Functions */
import { sleep } from '../functions/utils/sleep';

/* Types */
import { ChildCmd, ChildData, ParentCmd, Serializable, Source, SourceType, Task } from '../types';
import { NextFunction, Request, Response } from 'express';

/* Constants */
import Config from '../config';
import { childFile, childNotFound, error, message, slash } from '../constants/strings';
import { postChild } from '../functions/utils/postMessage';
import { compareArray } from '../functions/utils/compareArray';

class Parent {
    /* List of all childs */
    private childs: ChildData[] = [];
    /* Sources of middlewares & imports */
    private _sources: Source[] = [];
    /* List of unassigned tasks */
    private taskQueue: Task[] = [];
    /* Incremental id for childs */
    private inc : number = 0;

    constructor(threadCount : number = Config.threadCount) {
        /* Create X childs */
        for (let i = 0; i < threadCount; i++) {
            this.newChild();
        }
    };

    private newChild() : void {
        this.inc++;
        Config.verbose && console.info("Starting thread id :", this.inc);
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
            // const i = this.childs.find((child) => child.id === parsed.id);
            const z = this.childs.findIndex(child => child.id === parsed.id);
            if (z === -1) throw new Error(childNotFound);
            /* Handle cmds */
            switch (parsed.cmd) {
                case ChildCmd.ready: 
                    /* set child as ready */
                    this.childs[z].ready = true;
                    break;
                case ChildCmd.response:
                    /* Get response index */
                    const j = this.childs[z].tasks.findIndex((t) => t.id === parsed.tid);
                    /* Send response */
                    j !== -1  && (this.childs[z].tasks[j].res as any)[parsed.call](...parsed.args);
                    break;
                case ChildCmd.next:
                    /* Get task index */
                    let index = this.childs[z].tasks.findIndex((t) => t.id === parsed.tid);
                    /* Remove task && get next */
                    let next = (index !== -1 && this.childs[z].tasks.splice(index, 1).at(0)?.next);
                    /* Call next if args are provided */
                    parsed.arg !== undefined && next && next(parsed.arg);
                    break;
                default:
                    throw new Error(`Unknown command : '${parsed.cmd}'`);
            }
        });
        /* Handle child errors */
        child.on(error, (e: Error) => {
            console.error(e);
            if (Config.restartThreads)
                return this.newChild();
            else
                throw e;
        });
        Config.debug && console.debug("Creating child id ", this.inc, " :\nsources :", this._sources);
        /* Update child sources */
        postChild(child, {
            cmd: ParentCmd.setSource,
            source: this._sources
        });
        /* Save child */
        this.childs.push({
            id: this.inc,
            instance: child,
            tasks: [],
            ready: false
        });
    };

    public dispatchTask(task: Task) : void {
        const occupation : number[] = [];
        /* Get occupation of each child */
        for (let i = 0; i < this.childs.length; i++) {
            const child = this.childs[i];
            child.ready ? occupation.push(child.tasks.length) : occupation.push(Infinity);
        }
        /* Dispatch task queue */
        const min = Math.min(...occupation);
        /* Get index of child less used */
        const i = occupation.indexOf(min);
        /* Move task to child tasks */
        this.childs[i].tasks.push(task);
        /* Increase occupation score */
        occupation[i]++;
        /* Send task to child */
        postChild(this.childs[i].instance, {
            cmd: ParentCmd.request,
            req: Config.cleanRequest(task.req),
            id: task.id
        });
    };

    public addSource(source : string[]) : void {
        /* Add source to sources */
        for (let i = 0; i < source.length; i++) {
            this._sources.push({
                path: source[i],
                type: SourceType.CONTROLLER
            })
        }
        /* Send new sources to childs */
        this.postChilds(ParentCmd.setSource, {
            source: this._sources
        });
    };

    public addMiddleware(path: string, opts: Serializable[]) : void {
        /* Push in middlewares */
        this._sources.push({
            path,
            type: SourceType.GLOBAL_MIDDLEWARE,
            args: opts
        });
        /* Update childs */
        this.postChilds(ParentCmd.setSource, {
            source: this._sources
        })
    };

    public removeMiddleware(opts: Serializable[], path?: string) : void {
        /* Remove all middlewares if no path */
        if (!path) {
            /* Empty array */
            this._sources = this._sources.filter((source) => source.type !== SourceType.GLOBAL_MIDDLEWARE)
        } else {
            /* Fetch middleware to remove */
            for (let i = 0; i < this._sources.length; i++) {
                if (this._sources[i].type !== SourceType.GLOBAL_MIDDLEWARE) continue;
                /* Path match with opts */
                if (this._sources[i].path === path && compareArray(this._sources[i].args ?? [], opts))
                    /* Remove middleware */
                    this._sources.splice(i, 1)
            }
        }
        /* Update childs */
        this.postChilds(ParentCmd.setSource, {
            source: this._sources
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
    public get sourcesList() : Source[] {
        return this._sources;
    };
}

export const Instance = isMainThread ? new Parent() : null;

export default Instance;