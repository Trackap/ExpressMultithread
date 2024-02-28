import { expect } from "chai";
import { CallLoop } from "../../src/class/CallLoop";

describe("CallLoop tests", () => {
    it("should return in callback", (done) => {
        let value = false;
        const call = (req, res) => res.send();
        const res = {
            send: () => value = true
        }
        new CallLoop({} as any, res as any, [call]).handle()
            .then((r) => {
                expect(value).to.be.equal(true)
                done();
            })
            .catch((e) => {
                done(e);
            });
    });

    it ("should not call callback", (done) => {
        let value = false;
        const mid = (req, res, next) => res.send();
        const call = (req, res) => {
            throw new Error("Should not be called");
        };
        const res = {
            send: () => value = true
        };
        new CallLoop({} as any, res as any, [mid, call]).handle()
            .then((r) => {
                expect(value).to.be.equal(true);
                done();
            })
            .catch((e) => {
                done(e);
            });
    });

    it("should skip errMid", (done) => {
       let value = false;
       const mid = (req, res, next) => next();
       const err = (err, req, res, next) => {
           throw new Error("Should not be called");
       };
       const call = (req, res) => res.send();
       const res = {
           send: () => value = true
       }
       new CallLoop({} as any, res as any, [mid, err, call]).handle()
           .then((r) => {
               expect(value).to.be.equal(true);
               done();
           })
           .catch((e) => {
               done(e);
           })
    });

    it("should ret with errMid", (done) => {
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
        new CallLoop({} as any, res as any, [mid, call, err]).handle()
            .then(() => {
                expect(value).to.be.equal(true);
                done();
            })
            .catch((e) => {
                done(e);
            })
    })

    it("should not crash", (done) => {
        let value = false;
        const call = (req, res) => {
            throw new Error("crash")
        }
        const errMid = (err, req, res, next) => {
            value = true;
            next();
        }
        const loop = new CallLoop({} as any, {} as any, [call, errMid]);
        expect(() => loop.handle()
            .then(() => {
                expect(value).to.be.equal(true)
                done();
            })).to.not.throw()
    })

    it("should go on with crash", (done) => {
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
        new CallLoop({} as any, res as any, [mid, errMid, call]).handle()
            .then(() => {
                expect(value).to.be.equal(true);
                done()
            })
            .catch((e) => {
                done(e);
            })
    });

    it("should go error", (done) => {
        let value = false;
        const el = true;
        const mid = (req, res, next) => next(el);
        const errMid = (err, req, res, next) => {
            value = err;
        }
        new CallLoop({} as any, {} as any, [mid, errMid]).handle()
            .then(() => {
                expect(value).to.be.equal(true);
                done();
            })
            .catch((e) => done(e))
    });

    it("should resolve route", (done) => {
        const mid = (req, res, next) => next("route");
        new CallLoop({} as any, {} as any, [mid]).handle()
            .then((r) => {
                expect(r).to.be.equal("route")
                done()
            })
            .catch((e) => done(e))
    })
})