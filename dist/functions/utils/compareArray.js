"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareArray = void 0;
function compareArray(a, b) {
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
exports.compareArray = compareArray;
//# sourceMappingURL=compareArray.js.map