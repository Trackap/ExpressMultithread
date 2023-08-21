import { expect } from "chai";
import { walk } from "../../../src/functions/utils/walk";

describe('walk tests', () => {
    it("should find 2 files", () => {
        const files = walk("./test/samples");
        expect(Array.isArray(files)).to.equal(true);
        expect(files.length).to.equal(8);
        for (const file of files) {
            expect(file).to.be.a("string");
            expect(file).to.match(/.*\.ts$/);
        }
    });

    it("should throw an error", () => {
        /* File */
        expect(() => walk("./walk.bad.ts")).to.throw();
        /* Directory */
        expect(() => walk("/NOTEXISTING")).to.throw();
    });
});