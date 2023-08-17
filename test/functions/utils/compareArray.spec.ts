import { compareArray } from '../../../src/functions/utils/compareArray';
import { expect } from 'chai';

describe('compareArray tests', () => {
    it("should return true", () => {
        const arr = [1, 2, 3];
        expect(compareArray([1, 2, 3], [1, 2, 3])).to.be.true;
        expect(compareArray(["1", "2", "3"], ["1", "2", "3"])).to.be.true;
        expect(compareArray([true, false], [true, false])).to.be.true;
        expect(compareArray([arr], [arr])).to.be.true;
        expect(compareArray([], [])).to.be.true;

    });

    it("should return false", () => {
        const arr = [1, 2, 3];
        expect(compareArray([1, 2, 3], [1, 2])).to.be.false;
        expect(compareArray(["1", "2", "3"], ["1", "2", "4"])).to.be.false;
        expect(compareArray([true, false], [false, true])).to.be.false;
        expect(compareArray([[]], [[], []])).to.be.false;
        expect(compareArray(arr, Object.create(arr).reverse())).to.be.false;
        expect(compareArray([arr], [Object.create(arr).reverse()])).to.be.false;
    });
});