/* Modules */
import { isMainThread } from "worker_threads";
import { register } from "ts-node";

/* Types */
import type { Service } from "ts-node";

/* Constants */
import { isCompiled } from "../../constants/isCompiled";

if (isMainThread)
    throw new Error("This file should not be imported in the main thread");

const moduleCompiled = __filename.endsWith(".js");
let registered : undefined | Service = undefined;

export function registerTS(config?: string): void {
    if (!moduleCompiled || isCompiled) return;
    if (registered)
        registered.enabled(false);
    registered = register(config ? require(config) : {
        compilerOptions: {
            strict: false
        }
    });
}