/* Modules */
import { TSError } from 'ts-node';
import { Worker, isMainThread } from 'worker_threads';
import { randomUUID } from 'crypto';

/* Classes */
import { ChildError } from './ChildError';
import Config from './Config';

/* Functions */
import { sleep } from '../functions/utils/sleep';

/* Types */
import { ChildData, Task, ParentCmd, ChildCmd } from '../types';
import { NextFunction, Request, Response } from 'express';

/* Constants */
import { childFile, childNotFound, error, message, slash, unknownCmd } from '../constants/strings';
import { postChild } from '../functions/utils/postMessage';

class Parent {
    private childs: ChildData[] = [];
    private taskQueue: Task[] = [];
    private inc : number = 0;

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
                    i.ready = true;
                    break;
                case ChildCmd.response:
                    let res = i.tasks.find((t) => t.id === parsed.tid)?.res;
                    res && (res as any)[parsed.call](...parsed.args);
                    break;
                case ChildCmd.next:
                    let index = i.tasks.findIndex((t) => t.id === parsed.tid);
                    index !== -1 && i.tasks.splice(index, 1).at(0)?.next(parsed.arg);
                    break;
                default:
                    throw new Error(unknownCmd);
            }
        });
        /* Handle child errors */
        child.on(error, (e: ChildError) => {
            throw new TSError(e.diagnosticText, e.diagnosticCodes);
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
        /* Send new sources to childs */
        for (let i = 0; i < this.childs.length; i++) {
            postChild(this.childs[i].instance, {
                cmd: ParentCmd.addSource,
                source
            });
        }
    };
};

const Instance = isMainThread ? new Parent() : null;
Instance?.run();

export default Instance;