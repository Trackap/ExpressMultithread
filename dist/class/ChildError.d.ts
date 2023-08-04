export declare class ChildError extends Error {
    diagnosticText: string;
    diagnosticCodes: number[];
    constructor(diagnosticText: string, diagnosticCodes: number[]);
}
