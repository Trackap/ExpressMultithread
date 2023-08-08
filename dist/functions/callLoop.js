"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callLoop = void 0;
function callLoop(req, res, _callstack) {
    return new Promise(async (resolve, reject) => {
        let i = -1;
        while (++i < _callstack.length) {
            const layer = _callstack[i];
            if (layer.length === 2) {
                try {
                    await layer(req, res);
                }
                catch (e) {
                    reject(e);
                }
            }
            else {
                let done = undefined;
                let nextCalled = false;
                const promise = new Promise((solve) => {
                    done = (arg) => {
                        nextCalled = true;
                        solve(arg);
                    };
                });
                await Promise.race([layer(req, res, done), promise]);
                if (nextCalled) {
                    const res = (await promise);
                    if (res === "route" || res === "router") {
                        return resolve(res);
                    }
                    else if (res) {
                        return reject(res);
                    }
                }
                else {
                    break;
                }
            }
        }
        resolve(undefined);
    });
}
exports.callLoop = callLoop;
;
//# sourceMappingURL=callLoop.js.map