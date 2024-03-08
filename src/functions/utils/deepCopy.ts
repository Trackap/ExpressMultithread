export function deepCopy<T>(obj: T, hash = new WeakMap()): T {
    if (obj === null || typeof obj !== "object") return obj;
    if (hash.has(obj)) return hash.get(obj) as T;
    if (obj instanceof Date) return new Date(obj) as T;
    if (obj instanceof RegExp) return new RegExp(obj) as T;
    if (obj instanceof Array) {
        let copy = [] as unknown as T;
        hash.set(obj, copy);
        copy = obj.map((item) => deepCopy(item, hash)) as unknown as T;
        return copy;
    }
    if (obj instanceof Map) {
        let copy = new Map();
        hash.set(obj, copy);
        return new Map(Array.from(obj, ([key, value]) => [deepCopy(key, hash), deepCopy(value, hash)])) as unknown as T;
    }
    if (obj instanceof Set) {
        let copy = new Set();
        hash.set(obj, copy);
        return new Set(Array.from(obj, (value) => deepCopy(value, hash))) as unknown as T;
    }
    if (obj instanceof WeakMap) {
        let copy = new WeakMap();
        hash.set(obj, copy);
        for (let [key, value] of obj as any) {
            copy.set(deepCopy(key, hash), deepCopy(value, hash));
        }
        return copy as unknown as T;
    }
    if (obj instanceof WeakSet) {
        let copy = new WeakSet();
        hash.set(obj, copy);
        for (let value of obj as any) {
            copy.add(deepCopy(value, hash));
        }
        return copy as unknown as T;
    }
    if (obj instanceof Buffer) return Buffer.from(obj) as unknown as T;
    if (obj instanceof Object) {
        let copy = Object.create(Object.getPrototypeOf(obj));
        hash.set(obj, copy);
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                copy[key] = deepCopy(obj[key], hash);
            }
        }
        return copy as T;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
}