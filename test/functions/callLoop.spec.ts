import { expect } from "chai";
import { CallLoop } from "../../src/functions/callLoop";

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
                throw new Error("Something crashed");
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
                throw new Error("Something crashed");
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
               throw new Error("Something crashed");
           })
    });
})