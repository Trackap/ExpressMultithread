/* Modules */
import { cpus } from "os";

/* Functions */
import { importModule } from "../functions/utils/importModule";
import { cleanRequest } from "../functions/cleanRequest";
import { merge } from "../functions/utils/mergeObject";
import { importPlugin } from "../functions/importPlugins";
import { resolvePath } from "../functions/utils/resolvePath";

/* Types */
import type { BaseConfig, EmConfig } from "../types";
import type { Request } from "express";

/* Constants */
import { cfgFile, DispatcherType } from "../constants/strings";

const userCfg = importModule(cfgFile)?.default as BaseConfig | undefined;
export const cfg: EmConfig = {
    threadCount: (userCfg?.threadCount !== undefined ? userCfg?.threadCount : (process.env.THREAD_COUNT === undefined ? cpus().length : parseInt(process.env.THREAD_COUNT))),
    cleanRequest: userCfg?.cleanRequest ? (req: Request) => merge(userCfg!.cleanRequest!(req), cleanRequest(req)) : cleanRequest,
    plugins: importPlugin(userCfg?.plugins ?? []),
    overrideConsole: userCfg?.overrideConsole ?? true,
    debug: userCfg?.debug ?? false,
    verbose: userCfg?.verbose ?? true,
    restartThreads: userCfg?.restartThreads ?? true,
    tsconfigPath: userCfg?.tsconfigPath ?? resolvePath("./tsconfig.json"),
    awaitable: userCfg?.awaitable,
    dispatcher: userCfg?.dispatcher ?? DispatcherType.ROUND_ROBIN
};

export default cfg;