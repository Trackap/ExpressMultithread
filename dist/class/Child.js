"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var worker_threads_1 = require("worker_threads");
var overrideConsole_1 = require("../functions/overrideConsole");
var pathToRoute_1 = require("../functions/pathToRoute");
var callLoop_1 = require("../functions/callLoop");
var overrideRes_1 = require("../functions/overrideRes");
var postMessage_1 = require("../functions/utils/postMessage");
var types_1 = require("../types");
var strings_1 = require("../constants/strings");
var pNext = function (id, tid, arg) {
    (0, postMessage_1.postParent)({
        cmd: types_1.ChildCmd.next,
        id: id,
        tid: tid,
        arg: arg
    });
};
var Child = (function () {
    function Child() {
        this.routes = {};
        this.id = worker_threads_1.workerData.id;
        if (!worker_threads_1.parentPort)
            throw new Error(strings_1.noParentPort);
        (0, overrideConsole_1.override)(this.id);
        this.initChild();
    }
    ;
    Child.prototype.initChild = function () {
        var _this = this;
        worker_threads_1.parentPort.on(strings_1.message, function (data) { return __awaiter(_this, void 0, void 0, function () {
            var parsed;
            return __generator(this, function (_a) {
                parsed = JSON.parse(data);
                switch (parsed.cmd) {
                    case types_1.ParentCmd.addSource:
                        this.addSource(parsed.source);
                        break;
                    case types_1.ParentCmd.request:
                        this.handleRequest(parsed.req, parsed.id);
                        break;
                    default:
                        throw new Error(strings_1.unknownCmd);
                }
                return [2];
            });
        }); });
        (0, postMessage_1.postParent)({
            cmd: types_1.ChildCmd.ready,
            id: this.id
        });
        console.info("ready");
    };
    ;
    Child.prototype.handleRequest = function (req, _id) {
        return __awaiter(this, void 0, void 0, function () {
            var k;
            var _this = this;
            return __generator(this, function (_a) {
                k = req.method.toLowerCase() + req.baseUrl + req.path;
                if (!this.routes[k])
                    throw new Error(strings_1.routeNotFound);
                (0, callLoop_1.callLoop)(req, (0, overrideRes_1.overrideRes)(this.id, _id), this.routes[k].callstack)
                    .then(function (res) {
                    switch (res) {
                        case "route":
                            pNext(_this.id, _id, res);
                            break;
                        case "router":
                            pNext(_this.id, _id, res);
                            break;
                        default:
                            pNext(_this.id, _id, undefined);
                            break;
                    }
                })
                    .catch(function (e) {
                    pNext(_this.id, _id, e);
                });
                return [2];
            });
        });
    };
    ;
    Child.prototype.addSource = function (source) {
        Object.assign(this.routes, (0, pathToRoute_1.pathToRoute)(source));
    };
    ;
    return Child;
}());
;
if (worker_threads_1.isMainThread)
    throw new Error(strings_1.noMain);
var child = new Child();
//# sourceMappingURL=Child.js.map