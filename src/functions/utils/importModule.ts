export const importModule = (path : string) : any => {
    try {
        return require(path);
    } catch (e) {
        console.error(e);
        return {};
    }
}