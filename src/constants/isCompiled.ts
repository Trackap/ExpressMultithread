/* Modules */
import { existsSync } from "fs";

/* Functions */
import { resolvePath } from "../functions/utils/resolvePath";

const pathJs = resolvePath("./em.config.js");
const pathTs = resolvePath("./em.config.ts");
if (!existsSync(pathJs) && !existsSync(pathTs))
    throw new Error("Missing ExpressMultithread configuration file (em.config.{ts|js})");

export const isCompiled = existsSync(pathJs);
