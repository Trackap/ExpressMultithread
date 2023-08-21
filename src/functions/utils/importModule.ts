export const importModule = (path : string, debug: boolean = true) : any => {
    try {
        return require(path);
    } catch (e) {
        debug && console.error(e);
        return {};
    }
}