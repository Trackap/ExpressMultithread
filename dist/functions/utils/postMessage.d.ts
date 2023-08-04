/// <reference types="node" />
import { Worker } from "worker_threads";
import { Msg, ChildCmd, ParentCmd } from "../../types";
export declare function postParent<T extends Msg<ChildCmd>>(msg: T): void;
export declare function postChild<T extends Msg<ParentCmd>>(child: Worker, msg: T): void;
