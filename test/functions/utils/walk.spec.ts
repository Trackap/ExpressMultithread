import { expect } from "chai";
import { walk } from "../../../src/functions/utils/walk";

describe('walk tests', () => {
    it("should find 2 files", () => {
        const files = walk(`${__dirname}/../../samples`);
        expect(Array.isArray(files)).to.equal(true);
        expect(files.length).to.equal(2);
        for (const file of files) {
            expect(file).to.be.a("string");
            expect(file).to.match(/.*\.ts$/);
        }
    });

    it("should throw an error", () => {
        /* File */
        expect(() => walk("./walk.spec.ts")).to.throw();
        /* Directory */
        expect(() => walk("./subdir")).to.throw();
    });
});