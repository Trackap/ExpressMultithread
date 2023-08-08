"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Multithreaded = exports.MultithreadedRouter = void 0;
var express_1 = require("express");
var Config_1 = __importDefault(require("./Config"));
var Parent_1 = __importDefault(require("./Parent"));
var pathToRoute_1 = require("../functions/pathToRoute");
var toArray_1 = require("../functions/utils/toArray");
var wrap_1 = require("../functions/wrap");
var defaultPath = process.cwd();
var MultithreadedRouter = (function () {
    function MultithreadedRouter() {
        this.routes = {};
        this.middlewares = [];
        this._router = (0, express_1.Router)();
    }
    MultithreadedRouter.prototype.importControllers = function (path) {
        var _a;
        if (path === void 0) { path = defaultPath; }
        Parent_1.default.addSource((0, toArray_1.toArray)(path));
        var routes = (0, pathToRoute_1.pathToRoute)(path);
        var endpoints = Object.keys(routes);
        for (var i = 0; i < endpoints.length; i++) {
            var route = routes[endpoints[i]];
            var callstack = Config_1.default.threadCount > 0 ? [(0, wrap_1.wrapRequest)(endpoints[i])] : route.callstack;
            (_a = this._router)[route.method].apply(_a, __spreadArray([route.endpoint], callstack, false));
        }
    };
    ;
    Object.defineProperty(MultithreadedRouter.prototype, "router", {
        get: function () {
            return this._router;
        },
        enumerable: false,
        configurable: true
    });
    ;
    return MultithreadedRouter;
}());
exports.MultithreadedRouter = MultithreadedRouter;
;
exports.Multithreaded = new MultithreadedRouter();
exports.default = exports.Multithreaded;
//# sourceMappingURL=Router.js.map