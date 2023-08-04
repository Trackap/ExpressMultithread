"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathToRoute = void 0;
var toArray_1 = require("./utils/toArray");
var walk_1 = require("./utils/walk");
var importModule_1 = require("./utils/importModule");
var strings_1 = require("../constants/strings");
function exploreController(module) {
    var _a, _b, _c, _d;
    var controller = (_b = (_a = Object.getOwnPropertyDescriptors(module)) === null || _a === void 0 ? void 0 : _a.__controller) === null || _b === void 0 ? void 0 : _b.value;
    if (!controller)
        return undefined;
    var routes = {};
    var methods = Object.getOwnPropertyDescriptors(module.prototype);
    var keys = Object.keys(methods);
    for (var i = 0; i < keys.length; i++) {
        if (!keys[i].endsWith(strings_1.__route))
            continue;
        var route = methods[keys[i]].value;
        var endpoint = ((_c = controller.path) !== null && _c !== void 0 ? _c : strings_1.empty) + route.path;
        var controllerMid = (0, toArray_1.toArray)((_d = controller.middlewares) !== null && _d !== void 0 ? _d : []);
        var callstack = __spreadArray(__spreadArray(__spreadArray([], controllerMid, true), route.middlewares, true), [route.cb], false);
        routes[route.method + endpoint] = __assign(__assign({}, route), { callstack: callstack, endpoint: endpoint });
    }
    return routes;
}
function pathToRoute(path) {
    var _a;
    var res = {};
    path = (0, toArray_1.toArray)(path);
    for (var i = 0; i < path.length; i++) {
        var files = (0, walk_1.walk)(path[i]);
        for (var j = 0; j < files.length; j++) {
            var module_1 = (0, importModule_1.importModule)(files[j]);
            var k = Object.keys(module_1);
            for (var l = 0; l < k.length; l++) {
                if (k[l] !== strings_1.defaultStr && module_1[k[l]] === module_1.default)
                    continue;
                Object.assign(res, (_a = exploreController(module_1[k[l]])) !== null && _a !== void 0 ? _a : {});
            }
        }
    }
    return res;
}
exports.pathToRoute = pathToRoute;
//# sourceMappingURL=pathToRoute.js.map