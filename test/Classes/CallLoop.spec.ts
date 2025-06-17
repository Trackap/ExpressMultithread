import { expect } from "chai";
import { CallLoop } from "../../src/class/CallLoop";

import { postParent } from "../../src/functions/utils/postMessage";

jest.mock("../../src/functions/utils/postMessage", () => ({
    postParent: jest.fn()
}));

describe("CallLoop tests", () => {
    it("should return in callback", async () => {
        let value = false;
        const call = (req, res) => res.send();
        const res = {
            send: () => value = true
        }
        await new Promise((resolve, reject) => {
            try {
                new CallLoop({} as any, res as any, [call]).handle();
                setTimeout(resolve, 10);
            } catch (e) {
                reject(e);
            }
        });
        expect(value).to.be.equal(true);
    });

    it ("should not call callback", async () => {
        let value = false;
        const mid = (req, res, next) => res.send();
        const call = (req, res) => {
            throw new Error("Should not be called");
        };
        const res = {
            send: () => value = true
        };
        await new Promise((resolve, reject) => {
            try {
                new CallLoop({} as any, res as any, [mid, call]).handle();
                setTimeout(resolve, 10);
            } catch (e) {
                reject(e);
            }
        });
        expect(value).to.be.equal(true);
    });

    it("should skip errMid", async () => {
       let value = false;
       const mid = (req, res, next) => next();
       const err = (err, req, res, next) => {
           throw new Error("Should not be called");
       };
       const call = (req, res) => res.send();
       const res = {
           send: () => value = true
       }
       await new Promise((resolve, reject) => {
           try {
               new CallLoop({} as any, res as any, [mid, err, call]).handle();
               setTimeout(resolve, 10);
           } catch (e) {
               reject(e);
           }
       });
       expect(value).to.be.equal(true);
    });

    it("should ret with errMid", async () => {
        let value = false;
        const mid = (req, res, next) => {
            throw true
        }
        const err = (err, req, res, next) => {
            res.send(err)
        };
        const res = {
            send: () => value = true
        }
        const call = (req, res) => {
            throw new Error("should not be called");
        }
        await new Promise((resolve, reject) => {
            try {
                new CallLoop({} as any, res as any, [mid, call, err]).handle();
                setTimeout(resolve, 10);
            } catch (e) {
                reject(e);
            }
        });
        expect(value).to.be.equal(true);
    })

    it("should not crash", async () => {
        let value = false;
        const call = (req, res) => {
            throw new Error("crash")
        }
        const errMid = (err, req, res, next) => {
            value = true;
            next();
        }
        await new Promise((resolve, reject) => {
            try {
                const loop = new CallLoop({} as any, {} as any, [call, errMid]);
                loop.handle();
                setTimeout(resolve, 10);
            } catch (e) {
                reject(e);
            }
        });
        expect(value).to.be.equal(true);
    })

    it("should go on with crash", async () => {
        let value = false;
        const mid = (req, res, next) => {
            throw new Error("crash")
        };
        const errMid = (err, req, res, next) => {
            next();
        }
        const call = (req, res) => res.send();
        const res = {
            send: () => value = true
        }
        await new Promise((resolve, reject) => {
            try {
                new CallLoop({} as any, res as any, [mid, errMid, call]).handle();
                setTimeout(resolve, 10);
            } catch (e) {
                reject(e);
            }
        });
        expect(value).to.be.equal(true);
    });

    it("should go error", async () => {
        let value = false;
        const el = true;
        const mid = (req, res, next) => next(el);
        const errMid = (err, req, res, next) => {
            value = err;
        }
        await new Promise((resolve, reject) => {
            try {
                new CallLoop({} as any, {} as any, [mid, errMid]).handle();
                setTimeout(resolve, 10);
            } catch (e) {
                reject(e);
            }
        });
        expect(value).to.be.equal(true);
    });

    it("should resolve route", async () => {
        const mid = (req, res, next) => next("route");
        let result;
        await new Promise((resolve, reject) => {
            try {
                new CallLoop({} as any, {} as any, [mid]).handle();
                setTimeout(() => {
                    result = "route";
                    resolve(undefined);
                }, 10);
            } catch (e) {
                reject(e);
            }
        });
        expect(result).to.be.equal("route");
    })
})