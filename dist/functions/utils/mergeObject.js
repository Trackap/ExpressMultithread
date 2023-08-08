"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = void 0;
function merge(target, source) {
    const cpy = Object.assign({}, target);
    return Object.assign(cpy, source);
}
exports.merge = merge;
//# sourceMappingURL=mergeObject.js.map