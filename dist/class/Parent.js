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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts_node_1 = require("ts-node");
var worker_threads_1 = require("worker_threads");
var crypto_1 = require("crypto");
var Config_1 = __importDefault(require("./Config"));
var sleep_1 = require("../functions/utils/sleep");
var types_1 = require("../types");
var strings_1 = require("../constants/strings");
var postMessage_1 = require("../functions/utils/postMessage");
var Parent = (function () {
    function Parent(threadCount) {
        if (threadCount === void 0) { threadCount = Config_1.default.threadCount; }
        this.childs = [];
        this.taskQueue = [];
        this.inc = 0;
        for (var i = 0; i < threadCount; i++) {
            this.newChild();
        }
    }
    ;
    Parent.prototype.newChild = function () {
        var _this = this;
        this.inc++;
        var child = new worker_threads_1.Worker(__dirname + strings_1.slash + strings_1.childFile, {
            workerData: {
                id: this.inc
            }
        });
        child.on(strings_1.message, function (data) {
            var _a;
            var _b, _c;
            var parsed = JSON.parse(data);
            var i = _this.childs.find(function (child) { return child.id === parsed.id; });
            if (!i)
                throw new Error(strings_1.childNotFound);
            switch (parsed.cmd) {
                case types_1.ChildCmd.ready:
                    i.ready = true;
                    break;
                case types_1.ChildCmd.response:
                    var res = (_b = i.tasks.find(function (t) { return t.id === parsed.tid; })) === null || _b === void 0 ? void 0 : _b.res;
                    res && (_a = res)[parsed.call].apply(_a, parsed.args);
                    break;
                case types_1.ChildCmd.next:
                    var index = i.tasks.findIndex(function (t) { return t.id === parsed.tid; });
                    index !== -1 && ((_c = i.tasks.splice(index, 1).at(0)) === null || _c === void 0 ? void 0 : _c.next(parsed.arg));
                    break;
                default:
                    throw new Error(strings_1.unknownCmd);
            }
        });
        child.on(strings_1.error, function (e) {
            throw new ts_node_1.TSError(e.diagnosticText, e.diagnosticCodes);
        });
        this.childs.push({
            id: this.inc,
            instance: child,
            tasks: [],
            ready: false
        });
    };
    ;
    Parent.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!true) return [3, 2];
                        return [4, (0, sleep_1.sleep)(1)];
                    case 1:
                        _a.sent();
                        this.taskQueue.length && this.dispatchTask();
                        return [3, 0];
                    case 2: return [2];
                }
            });
        });
    };
    ;
    Parent.prototype.dispatchTask = function () {
        var occupation = [];
        for (var i = 0; i < this.childs.length; i++) {
            var child = this.childs[i];
            child.ready ? occupation.push(child.tasks.length) : occupation.push(Infinity);
        }
        while (this.taskQueue.length) {
            var min = Math.min.apply(Math, occupation);
            if (min === Infinity)
                break;
            var i = occupation.indexOf(min);
            var task = this.taskQueue.shift();
            this.childs[i].tasks.push(task);
            occupation[i]++;
            (0, postMessage_1.postChild)(this.childs[i].instance, {
                cmd: types_1.ParentCmd.request,
                req: Config_1.default.cleanRequest(task.req),
                id: task.id
            });
        }
    };
    ;
    Parent.prototype.addTask = function (endpoint, req, res, next) {
        this.taskQueue.push({
            endpoint: endpoint,
            req: req,
            res: res,
            next: next,
            id: (0, crypto_1.randomUUID)()
        });
    };
    ;
    Parent.prototype.addSource = function (source) {
        for (var i = 0; i < this.childs.length; i++) {
            (0, postMessage_1.postChild)(this.childs[i].instance, {
                cmd: types_1.ParentCmd.addSource,
                source: source
            });
        }
    };
    ;
    return Parent;
}());
;
var Instance = worker_threads_1.isMainThread ? new Parent() : null;
Instance === null || Instance === void 0 ? void 0 : Instance.run();
exports.default = Instance;
//# sourceMappingURL=Parent.js.map