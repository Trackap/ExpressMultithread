/* Modules */
import { resolve } from "path";

/* Constants */
const cwd = process.cwd();

export const importModule = (path : string, debug: boolean = true) : any => {
    try {
        return require(resolve(cwd, path));
    } catch (e) {
        debug && console.error(e);
        return {};
    }
}