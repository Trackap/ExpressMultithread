export function merge<T extends Object>(target: T, source: T) {
    const cpy = Object.assign({}, target);
    return Object.assign(cpy, source);
}