"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildError = void 0;
class ChildError extends Error {
    constructor(diagnosticText, diagnosticCodes) {
        super(diagnosticText);
        this.diagnosticText = diagnosticText;
        this.diagnosticCodes = diagnosticCodes;
    }
    ;
}
exports.ChildError = ChildError;
;
//# sourceMappingURL=ChildError.js.map