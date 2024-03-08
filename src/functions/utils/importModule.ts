/* Functions */
import { resolvePath } from "./resolvePath";

export const importModule = (path : string) : any => {
    try {
        return require(resolvePath(path));
    } catch (e) {
        console.error(e);
        return {};
    }
}