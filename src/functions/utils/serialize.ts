import { Script, Context, createContext } from 'vm';
import { readFileSync } from 'fs';
import { Request, Response } from "express";
import { Import } from '@em/types';
import { toArray } from './toArray';
import { createHash } from 'crypto';
import { sleep } from './sleep';
import { cLeft, cRight, empty } from '../../constants/strings';

const a = function test(req: Request, res: Response) {
    req.body.a += 1;
    sleep(100);
    res.send(req.body.a);
};

const inc = function (a: number) {
    return function test(req: Request, res: Response) {
        req.body.a += a;
        res.send(req.body.a);
    }
}

export class Serializer {
    private _imports : string = "";
    private _fn: string;
    private _opts: any[];

    constructor(fn: string, opts: any[]) {
        this._fn = fn;
        this._opts = opts;
    };
    
    public get get() {
        return this._imports + (this._opts.length ?
            `((${this._fn})(${this._opts.map((o: any) => JSON.stringify(o)).join(", ")}))(req, res, next)`
          : `(${this._fn})(req, res, next)`);
    };

    public set opts(opts: any[]) {
        this._opts = opts;
    };

    public addImport(imp: Import | Import[]) {
        imp = toArray(imp);
        for (let i = 0; i < imp.length; i++) {
            const { module, path, packed } = imp[i];
            this._imports = `const ${ packed ? cRight : empty} ${module} ${ packed ? cLeft : empty} = require('${path}')\n` + this._imports;
        }
    }
};

export function fromFunction(fn: Function, ...opts: any[]) {
    return new Serializer(fn.toString(), opts);
};

export function fromFile(path: string, ...opts: any[]) {
    return new Serializer(readFileSync(path, "utf8"), opts);
};

export class Deserializer {
    private _script: Script;
    private _hash: string;

    constructor(fn: string) {
        this._script = new Script(fn);
        this._hash = createHash("md5").update(fn).digest("hex");
    };

    public run(context: Record<string, any>) : Context {
        createContext(context);
        this._script.runInContext(context);
        return context;
    };

    public get hash() {
        return this._hash;
    };

    public get script() {
        return this._script;
    };
};
const md = fromFunction(a);
md.addImport({ module: "sleep", path: "./sleep", packed: true });
const res = new Deserializer(md.get).run({ req: { body: { a: 12 } }, res: { send: console.log } });
console.log(res);

// let req = {
//     body: {
//         a: 12
//     }
// };

// let res = {
//     send: console.log
// }

// /* Call Loop */
// const context = { req, res };
// vm.createContext(context);
// const script = new vm.Script(`(${a.toString()})(req, res)`);
// console.log(script);
// script.runInContext(context);
// console.log(context);
