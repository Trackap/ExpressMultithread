"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walk = void 0;
const fs_1 = __importDefault(require("fs"));
const strings_1 = require("../../constants/strings");
const walk = (dir) => {
    const directories = [dir];
    const ret = [];
    while (directories.length > 0) {
        const path = directories.pop();
        if (path.includes(strings_1.node_modules))
            continue;
        const files = fs_1.default.readdirSync(path);
        for (let i = 0; i < files.length; i++) {
            const fullpath = path + strings_1.slash + files[i];
            if (fs_1.default.lstatSync(fullpath).isDirectory())
                directories.push(fullpath);
            else
                fullpath.endsWith(strings_1.tsFile) && ret.push(fullpath);
        }
    }
    return ret;
};
exports.walk = walk;
//# sourceMappingURL=walk.js.map