/* Modules */
import { isMainThread } from "worker_threads";

/* Constants */
import { noMain, Reset, space, bLeft, bRight, FgCyan, FgGray, FgYellow, FgRed, logConsole, infoConsole, warnConsole, errorConsole } from "../constants/strings";
const orig = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
};

if (isMainThread)
    throw new Error(noMain);
export const override = (id: number) => {
    const base = Reset + space + bRight + id.toString() + bLeft + space;
    console.log = (...args: any[]) => orig.log(FgGray + logConsole + base, ...args)
    console.info = (...args: any[]) => orig.info(FgCyan + infoConsole + base, ...args)
    console.warn = (...args: any[]) => orig.warn(FgYellow + warnConsole + base, ...args)
    console.error = (...args: any[]) => orig.error(FgRed + errorConsole + base, ...args)
}

export const revert = () => {
    console.log = orig.log;
    console.info = orig.info;
    console.warn = orig.warn;
    console.error = orig.error;
}