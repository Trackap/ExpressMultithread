"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const strings_1 = require("../../constants/strings");
function route(method, path, ...middlewares) {
    return (target, propertyKey) => {
        Object.defineProperty(target, propertyKey + strings_1.__route, { value: { method, path, middlewares, cb: target[propertyKey] } });
        return target;
    };
}
exports.route = route;
//# sourceMappingURL=route.js.map