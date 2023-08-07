import { toArray } from '../../../src/functions/utils/toArray';
import { expect } from 'chai';

describe('toArray tests', () => {
    it("should return an array", () => {
        expect(toArray(1)).to.deep.equal([1]);
        expect(toArray([1,2,3])).to.deep.equal([1,2,3]);
        expect(toArray({a: 1, b: 2})).to.deep.equal([{a: 1, b: 2}]);
        expect(toArray("Hello")).to.deep.equal(["Hello"]);
        expect(toArray(true)).to.deep.equal([true]);
        expect(toArray(null)).to.deep.equal([null]);
        expect(toArray(undefined)).to.deep.equal([undefined]);
    });
});