import { merge } from '../../../src/functions/utils/mergeObject';
import { expect } from 'chai';

describe('mergeObject tests', () => {
    it("should merge two objects", () => {
        const a = {a: 1, b: 2};
        const b = {a: 1, b: 4, c: 5};
        const c = merge(a, b);
        expect(c).to.deep.equal({a: 1, b: 4, c: 5});
    });

    it("it should not modify the original objects", () => {
        const a = {a: 1, b: 2};
        const b = {a: 1, b: 4, c: 5};
        const c = merge(a, b);
        void c;
        expect(a).to.deep.equal({a: 1, b: 2});
        expect(b).to.deep.equal({a: 1, b: 4, c: 5});
    });

    it("should create a cpy of the target object", () => {
        const a = {a: 1, b: 2};
        const b = {a: 1, b: 4, c: 5};
        const c = merge(a, b);
        expect(c).not.equal(a);
        expect(c).not.equal(b);
    });
});
