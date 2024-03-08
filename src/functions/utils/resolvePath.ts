/* Modules */
import { resolve, join } from "path";

/* Constants */
const cwd = process.cwd();

export function resolvePath(path: string | string[]) {
    return resolve(cwd, Array.isArray(path) ? join(...path) : path);
}