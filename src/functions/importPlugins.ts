/* Modules */
import { resolve } from "path";
import { randomUUID } from "crypto";

/* Classes */
import Plugin from "../class/Plugin";

/* Functions */
import { importModule } from "./utils/importModule";

/* Types */
import { PluginBase } from "../types";
import { invalidPlugin } from "../constants/strings";

export function importPlugin(plugins: string[]) : PluginBase[] {
    const cwd = process.cwd();
    const ret : PluginBase[] = [];
    for (let i = 0; i < plugins.length; i++) {
        const plugin = importModule(resolve(cwd, plugins[i]))?.default;
        if (!plugin || !(plugin.prototype instanceof Plugin))
            throw new Error(invalidPlugin + plugins[i]);
        ret.push(new plugin(randomUUID()));
    }
    return ret;
}