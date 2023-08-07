import { expect } from "chai";
import { pathToRoute } from "../src/functions/pathToRoute";

describe('pathToRoute tests', () => {
    it("should return routes", () => {
        const routes = pathToRoute(`${__dirname}/samples`);
        expect(routes).to.be.a("object");
        expect(Object.keys(routes).length).to.equal(7);
        expect(routes).to.have.property("get/");
        expect(routes["get/"].method).to.be.equal("get");
        expect(routes["get/"].path).to.be.equal("/");
        expect(routes["get/"].endpoint).to.be.equal("/");
        expect(Array.isArray(routes["get/"].middlewares)).to.be.equal(true);
        expect(Array.isArray(routes["get/"].callstack)).to.be.equal(true);
        expect(routes["get/"].cb).to.be.a("function");
    });

    it("should throw an error", () => {
        expect(() => pathToRoute(`${__dirname}/samples/emptyController.ts`)).to.throw();
        expect(() => pathToRoute(`${__dirname}/samples/notExistingDir`)).to.throw();
    });
});