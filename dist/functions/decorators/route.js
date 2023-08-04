"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
var strings_1 = require("../../constants/strings");
function route(method, path) {
    var middlewares = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        middlewares[_i - 2] = arguments[_i];
    }
    return function (target, propertyKey) {
        Object.defineProperty(target, propertyKey + strings_1.__route, { value: { method: method, path: path, middlewares: middlewares, cb: target[propertyKey] } });
        return target;
    };
}
exports.route = route;
//# sourceMappingURL=route.js.map