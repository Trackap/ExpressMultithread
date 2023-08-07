import { expect } from "chai";
import { importModule } from "../../../src/functions/utils/importModule";

describe('importModule tests', () => {
    it("should import a module", () => {
        const module = importModule(`${__dirname}/../../samples/emptyController.ts`);
        expect(module).to.be.an("object");
        expect(module).to.have.property("default");
        expect(module.default).to.be.a("function");
    });

    it("should return empty object", () => {
        const module = importModule(`${__dirname}/../../samples/empty.txt`);
        expect(module).to.be.a("object");
        expect(module).to.be.deep.equal({});
    });

    it("should not throw an error", () => {
        expect(() => importModule("./notExistingModule.ts")).to.not.throw();
    });
});