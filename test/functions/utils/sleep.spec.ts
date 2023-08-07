import { expect } from "chai";
import { sleep } from "../../../src/functions/utils/sleep";

describe('sleep tests', () => {
    it("should sleep for 1 second", async () => {
        const start = Date.now();
        await sleep(1000);
        const diff = Date.now() - start;
        expect(diff).to.be.greaterThan(999);
        expect(diff).to.be.lessThan(1100);
    });
});