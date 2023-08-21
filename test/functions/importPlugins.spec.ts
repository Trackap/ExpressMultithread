import { importPlugin } from "../../src/functions/importPlugins";
import { expect } from "chai";

describe("importPlugins tests", () => {
    it("should not throw bad args", () => {
        expect(importPlugin([])).to.deep.equal([]);
    });
    
    it("should throw bad file", () => {
        expect(() => importPlugin([
            "./test/samples/subDir/notexisting.ts"
        ])).to.throw();
        expect(() => importPlugin([
            "./test/samples/subDir/empty.txt"
        ])).to.throw();

        expect(() => importPlugin([
            "./test/samples/plugins/noDefault.ts"
        ])).to.throw();

        expect(() => importPlugin([
            "./test/samples/plugins/badHerit.ts"
        ])).to.throw();
    });

    it("should return plugins", () => {
        const plugin = importPlugin([
            "./test/samples/plugins/good.ts"
        ])[0];
        expect(plugin).to.be.an("object");
        expect(plugin).to.have.property("__id");
        expect(plugin).to.have.property("kind");
        expect(plugin).to.have.property("test");
        expect(plugin.cb).to.be.a("function");
    });
});