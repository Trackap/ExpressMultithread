/* Modules */
import { isMainThread, parentPort, Worker } from "worker_threads";

/* Types */
import { Msg, ChildCmd, ParentCmd } from "../../types";

/* Constants */
import { noMain } from "../../constants/strings";

export function postParent<T extends Msg<ChildCmd>>(msg: T) {
    if (isMainThread || !parentPort)
        throw new Error(noMain);
    parentPort.postMessage(JSON.stringify(msg));
}
export function postChild<T extends Msg<ParentCmd>>(child : Worker, msg: T) {
    child.postMessage(JSON.stringify(msg));
}