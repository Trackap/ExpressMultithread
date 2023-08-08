"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Multithreaded = exports.MultithreadedRouter = void 0;
const express_1 = require("express");
const Config_1 = __importDefault(require("./Config"));
const Parent_1 = __importDefault(require("./Parent"));
const pathToRoute_1 = require("../functions/pathToRoute");
const toArray_1 = require("../functions/utils/toArray");
const wrap_1 = require("../functions/wrap");
const defaultPath = process.cwd();
class MultithreadedRouter {
    constructor() {
        this.routes = {};
        this.middlewares = [];
        this._router = (0, express_1.Router)();
    }
    importControllers(path = defaultPath) {
        Parent_1.default.addSource((0, toArray_1.toArray)(path));
        const routes = (0, pathToRoute_1.pathToRoute)(path);
        const endpoints = Object.keys(routes);
        for (let i = 0; i < endpoints.length; i++) {
            const route = routes[endpoints[i]];
            const callstack = Config_1.default.threadCount > 0 ? [(0, wrap_1.wrapRequest)(endpoints[i])] : route.callstack;
            this._router[route.method](route.endpoint, ...callstack);
        }
    }
    ;
    get router() {
        return this._router;
    }
    ;
}
exports.MultithreadedRouter = MultithreadedRouter;
;
exports.Multithreaded = new MultithreadedRouter();
exports.default = exports.Multithreaded;
//# sourceMappingURL=Router.js.map