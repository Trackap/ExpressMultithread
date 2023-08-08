"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importModule = void 0;
const importModule = (path) => {
    try {
        return require(path);
    }
    catch (e) {
        console.error(e);
        return {};
    }
};
exports.importModule = importModule;
//# sourceMappingURL=importModule.js.map