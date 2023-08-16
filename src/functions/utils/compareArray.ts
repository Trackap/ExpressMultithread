/* Compare two arays, return true if they are equal, false otherwise */
export function compareArray<T extends any[]>(a: T, b: T) : boolean {
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}