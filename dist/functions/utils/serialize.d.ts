/// <reference types="node" />
import { Script, Context } from 'vm';
import { Import } from '@em/types';
export declare class Serializer {
    private _imports;
    private _fn;
    private _opts;
    constructor(fn: string, opts: any[]);
    get get(): string;
    set opts(opts: any[]);
    addImport(imp: Import | Import[]): void;
}
export declare function fromFunction(fn: Function, ...opts: any[]): Serializer;
export declare function fromFile(path: string, ...opts: any[]): Serializer;
export declare class Deserializer {
    private _script;
    private _hash;
    constructor(fn: string);
    run(context: Record<string, any>): Context;
    get hash(): string;
    get script(): Script;
}
