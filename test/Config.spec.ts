import Config from '../src/config';
import { cleanRequest } from '../src/functions/cleanRequest';
import { expect } from 'chai';
import { merge } from '../src/functions/utils/mergeObject';
import { Request } from 'express';

const defaultObj = {
    body: undefined,
    params: undefined,
    query: undefined,
    headers: undefined,
    path: undefined,
    method: undefined
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
                route: {},
                disapear: () => {}
            } as any;
            expect(Config.cleanRequest(req)).to.deep.equal(defaultObj);
        });

        it("should merge cleanReq function", () => {
            const func = (req: any) => { req.test = false; return req; };
            const req = {
                test: true,
                route: {}
            } as any;
            Config.cleanRequest = (req: Request) => merge(func(req), cleanRequest(req));
            expect(Config.cleanRequest(req)).to.deep.equal(Object.assign({
                test: false,
            }, {...defaultObj, route: {}}));
        });
    });
});