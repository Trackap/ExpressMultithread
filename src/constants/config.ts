/* Modules */
import { cpus } from "os";
import { resolve } from "path";

/* Functions */
import { importModule } from "../functions/utils/importModule";
import { cleanRequest } from "../functions/cleanRequest";
import { merge } from "../functions/utils/mergeObject";
import { importPlugin } from "../functions/importPlugins";

/* Types */
import { BaseConfig } from "../types";

/* Constants */
import { cfgFile } from "../constants/strings";

const userCfg = importModule(cfgFile, false)?.default as BaseConfig | undefined;
const cfg = {
    threadCount: userCfg?.threadCount ?? (process.env.THREAD_COUNT === undefined ? cpus().length : parseInt(process.env.THREAD_COUNT)),
    cleanRequest: userCfg?.cleanRequest ? merge(userCfg.cleanRequest, cleanRequest): cleanRequest,
    plugins: importPlugin(userCfg?.plugins ?? [])
};

export default cfg;
