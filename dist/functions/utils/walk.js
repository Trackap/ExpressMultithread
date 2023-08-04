"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walk = void 0;
var fs_1 = __importDefault(require("fs"));
var strings_1 = require("../../constants/strings");
var walk = function (dir) {
    var directories = [dir];
    var ret = [];
    while (directories.length > 0) {
        var path = directories.pop();
        if (path.includes(strings_1.node_modules))
            continue;
        var files = fs_1.default.readdirSync(path);
        for (var i = 0; i < files.length; i++) {
            var fullpath = path + strings_1.slash + files[i];
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