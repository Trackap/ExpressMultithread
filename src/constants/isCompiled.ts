import { resolve } from "path";
import { existsSync } from "fs";

const pathJs = resolve(process.cwd(), "./em.config.js");
const pathTs = resolve(process.cwd(), "./em.config.ts");
if (!existsSync(pathJs) && !existsSync(pathTs))
    throw new Error("Missing ExpressMultithread configuration file (em.config.{ts|js})");

export const isCompiled = existsSync(pathJs);
