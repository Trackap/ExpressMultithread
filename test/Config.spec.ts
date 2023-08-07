import Config from '../src/class/Config';
import { cleanRequest } from '../src/functions/cleanRequest';
import { expect } from 'chai';
// import { merge } from '../src/functions/utils/mergeObject';

const defObj = {
    baseUrl: undefined,
    body: undefined,
    headers: undefined,
    method: undefined,
    params: undefined,
    path: undefined,
    query: undefined
};

describe('Config tests', () => {
    describe('threadCount tests', () => {
        it("should return the thread count", () => {
            expect(Config.threadCount).to.be.a("number");
        });

        it("should set the thread count", () => {
            let tc = Config.threadCount === 2 ? 3 : 2;
            Config.threadCount = tc;
            expect(Config.threadCount).to.equal(tc);
        });
    });

    describe("cleanRequest tests", () => {
        it("should return the cleanRequest function", () => {
            expect(Config.cleanRequest).to.be.a("function");
            expect(Config.cleanRequest).to.equal(cleanRequest);
        });

        it("should clean object", () => {
            const req = {
                test: true,
                route: {}
            } as any;
            expect(Config.cleanRequest(req)).to.deep.equal(defObj);
        });

        it("should merge cleanReq function", () => {
            const func = (req: any) => { req.test = false; return req; };
            const req = {
                test: true,
                route: {}
            } as any;
            Config.cleanRequest = func;
            expect(Config.cleanRequest(req)).to.deep.equal(Object.assign({
                test: false,
            }, {...defObj, route: {}}));
        });
    });
});