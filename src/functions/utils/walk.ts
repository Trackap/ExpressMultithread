/* Modules */
import fs from "fs";
import { extname } from "path";

/* Constants */
import { node_modules, slash, tsFile } from "../../constants/strings";

export const walk = (dir: string) : string[] => {
    const directories = [dir];
    const ret : string[] = [];
    while (directories.length > 0) {
        /* Get last directory */
        const path = directories.pop() as string;
        /* Skip node_modules */
        if (path.includes(node_modules)) continue;
        const files = fs.readdirSync(path);
        for (let i = 0; i < files.length; i++) {
            /* Compose full path */
            const fullpath = path + slash + files[i];
            if (fs.lstatSync(fullpath).isDirectory())
                directories.push(fullpath);
            else
                extname(fullpath) === tsFile && ret.push(fullpath);
        }
    }
    return ret;
};