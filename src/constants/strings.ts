import { isCompiled } from "./isCompiled";

/* Characters */
export const slash = "/";
export const empty = "";
export const nl = "\n";
export const space = " ";
export const bRight = "[";
export const bLeft = "]";

/* Types */
export const fnStr = "function";

/* Keys */
export const defaultStr = "default";
export const __controller = "__controller";
export const __route = "__route";
export const get = "get";
export const set = "set";
export const route = "route";
export const router = "router";

/* Files */
export const tsFile =  isCompiled ? ".js": ".ts";
export const node_modules = "node_modules";
export const childFile = "Child.js";
export const cfgFile = `em.config.${isCompiled ? "js": "ts"}`;

/* Workers */
export const message = "message";
export const error = "error";

/* Messages */
export const childNotFound = "Child not found";
export const noMain = "This file is not meant to be run in the main thread.";
export const routeNotFound = "Route not found";
export const notImplemented = "Not implemented";
export const invalidPlugin = "Invalid plugin";
export const keywordUse = "Decoration of a class method named with keyword (get or set)";

/* Console */
export const Reset = "\x1b[0m"
export const FgGray = "\x1b[90m"
export const FgCyan = "\x1b[36m"
export const FgYellow = "\x1b[33m"
export const FgRed = "\x1b[31m"

export const logConsole = "[L]";
export const infoConsole = "[I]";
export const warnConsole = "[W]";
export const errorConsole = "[E]";