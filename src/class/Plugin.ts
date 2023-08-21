export default class Plugin {
    public __id: string;

    constructor(id: string) {
        this.__id = id;
    }

    public get id() : string {
        return this.__id;
    }
}