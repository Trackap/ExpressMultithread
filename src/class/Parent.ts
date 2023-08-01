/* Modules */
import { Worker, isMainThread } from 'worker_threads';

/* Constants */
import { THREAD_COUNT } from '../constants/config';
import { childFile, childNotFound, ready, response, slash } from '../constants/strings';
import { ChildData, Task } from '../types';

class Parent {
    private childs: ChildData[] = [];
    private taskQueue: Task[] = [];
    private inc : number = 0;

    constructor(threadCount : number = THREAD_COUNT) {
        for (let i = 0; i < threadCount; i++) {
            this.newChild();
        }
    };

    private newChild() : void {
        this.inc++;
        const child = new Worker(__dirname + slash + childFile, {
            workerData: {
                id: this.inc
                // ADD SOURCES
            }
        });
        child.on('message', (data) => {
            const [cmd, opts] = data;
            const i = this.childs.find((child) => child.id === opts.id);
            if (!i) throw new Error(childNotFound);
            switch (cmd) {
                case ready: 
                    i.ready = true;
                    break;
                case response:
                    i.tasks.find((t) => t.id === opts.id) // RETURN ?
            }
        })
    };
}

const Instance = isMainThread ? new Parent() : null;
Instance?.run();

export default Instance;