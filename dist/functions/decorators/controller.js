"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
var toArray_1 = require("../../functions/utils/toArray");
var strings_1 = require("../../constants/strings");
function controller(opts) {
    opts = opts || {
        middlewares: []
    };
    (opts === null || opts === void 0 ? void 0 : opts.middlewares) && (opts.middlewares = (0, toArray_1.toArray)(opts.middlewares));
    return function (target) {
        Object.defineProperty(target, strings_1.__controller, { value: opts });
        return target;
    };
}
exports.controller = controller;
//# sourceMappingURL=controller.js.map