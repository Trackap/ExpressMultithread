"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deserializer = exports.fromFile = exports.fromFunction = exports.Serializer = void 0;
const vm_1 = require("vm");
const fs_1 = require("fs");
const toArray_1 = require("./toArray");
const crypto_1 = require("crypto");
const sleep_1 = require("./sleep");
const strings_1 = require("../../constants/strings");
const a = function test(req, res) {
    req.body.a += 1;
    (0, sleep_1.sleep)(100);
    res.send(req.body.a);
};
const inc = function (a) {
    return function test(req, res) {
        req.body.a += a;
        res.send(req.body.a);
    };
};
class Serializer {
    constructor(fn, opts) {
        this._imports = "";
        this._fn = fn;
        this._opts = opts;
    }
    ;
    get get() {
        return this._imports + (this._opts.length ?
            `((${this._fn})(${this._opts.map((o) => JSON.stringify(o)).join(", ")}))(req, res, next)`
            : `(${this._fn})(req, res, next)`);
    }
    ;
    set opts(opts) {
        this._opts = opts;
    }
    ;
    addImport(imp) {
        imp = (0, toArray_1.toArray)(imp);
        for (let i = 0; i < imp.length; i++) {
            const { module, path, packed } = imp[i];
            this._imports = `const ${packed ? strings_1.cRight : strings_1.empty} ${module} ${packed ? strings_1.cLeft : strings_1.empty} = require('${path}')\n` + this._imports;
        }
    }
}
exports.Serializer = Serializer;
;
function fromFunction(fn, ...opts) {
    return new Serializer(fn.toString(), opts);
}
exports.fromFunction = fromFunction;
;
function fromFile(path, ...opts) {
    return new Serializer((0, fs_1.readFileSync)(path, "utf8"), opts);
}
exports.fromFile = fromFile;
;
class Deserializer {
    constructor(fn) {
        this._script = new vm_1.Script(fn);
        this._hash = (0, crypto_1.createHash)("md5").update(fn).digest("hex");
    }
    ;
    run(context) {
        (0, vm_1.createContext)(context);
        this._script.runInContext(context);
        return context;
    }
    ;
    get hash() {
        return this._hash;
    }
    ;
    get script() {
        return this._script;
    }
    ;
}
exports.Deserializer = Deserializer;
;
const md = fromFunction(a);
md.addImport({ module: "sleep", path: "./sleep", packed: true });
const res = new Deserializer(md.get).run({ req: { body: { a: 12 } }, res: { send: console.log } });
console.log(res);
//# sourceMappingURL=serialize.js.map