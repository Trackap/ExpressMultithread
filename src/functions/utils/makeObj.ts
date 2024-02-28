export function makeObj(obj: any, properties: string[]) : Record<string, any> {
    const ret = {};
    for (let i = 0; i < properties.length; i++) {
        ret[properties[i]] = obj[properties[i]];
    }
    return ret;
}