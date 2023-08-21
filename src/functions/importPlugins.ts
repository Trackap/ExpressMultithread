/* Modules */
import { randomUUID } from "crypto";

/* Classes */
import Plugin from "../class/Plugin";

/* Functions */
import { importModule } from "./utils/importModule";

/* Types */
import { PluginBase } from "../types";
import { invalidPlugin } from "../constants/strings";

export function importPlugin(plugins: string[]) : PluginBase[] {
    const ret : PluginBase[] = [];
    for (let i = 0; i < plugins.length; i++) {
        const plugin = importModule(plugins[i])?.default;
        if (!plugin || !(plugin.prototype instanceof Plugin))
            throw new Error(invalidPlugin + plugins[i]);
        ret.push(new plugin(randomUUID()));
    }
    return ret;
}