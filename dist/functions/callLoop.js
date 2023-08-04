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
exports.callLoop = void 0;
function callLoop(req, res, _callstack) {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var i, _loop_1, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = -1;
                    _loop_1 = function () {
                        var layer, e_1, done_1, nextCalled_1, promise, res_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    layer = _callstack[i];
                                    if (!(layer.length === 2)) return [3, 5];
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    return [4, layer(req, res)];
                                case 2:
                                    _b.sent();
                                    return [3, 4];
                                case 3:
                                    e_1 = _b.sent();
                                    reject(e_1);
                                    return [3, 4];
                                case 4: return [3, 9];
                                case 5:
                                    done_1 = undefined;
                                    nextCalled_1 = false;
                                    promise = new Promise(function (solve) {
                                        done_1 = function (arg) {
                                            nextCalled_1 = true;
                                            solve(arg);
                                        };
                                    });
                                    return [4, Promise.race([layer(req, res, done_1), promise])];
                                case 6:
                                    _b.sent();
                                    if (!nextCalled_1) return [3, 8];
                                    return [4, promise];
                                case 7:
                                    res_1 = (_b.sent());
                                    if (res_1 === "route" || res_1 === "router") {
                                        return [2, { value: resolve(res_1) }];
                                    }
                                    else if (res_1) {
                                        return [2, { value: reject(res_1) }];
                                    }
                                    return [3, 9];
                                case 8: return [2, "break"];
                                case 9: return [2];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!(++i < _callstack.length)) return [3, 3];
                    return [5, _loop_1()];
                case 2:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2, state_1.value];
                    if (state_1 === "break")
                        return [3, 3];
                    return [3, 1];
                case 3:
                    resolve(undefined);
                    return [2];
            }
        });
    }); });
}
exports.callLoop = callLoop;
;
//# sourceMappingURL=callLoop.js.map