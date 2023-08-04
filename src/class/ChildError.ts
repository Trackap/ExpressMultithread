export class ChildError extends Error {
    public diagnosticText: string;
    public diagnosticCodes: number[];

    constructor(diagnosticText : string, diagnosticCodes: number[]) {
        super(diagnosticText);
        this.diagnosticText = diagnosticText;
        this.diagnosticCodes = diagnosticCodes;
    };
};