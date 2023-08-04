"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildError = void 0;
var ChildError = (function (_super) {
    __extends(ChildError, _super);
    function ChildError(diagnosticText, diagnosticCodes) {
        var _this = _super.call(this, diagnosticText) || this;
        _this.diagnosticText = diagnosticText;
        _this.diagnosticCodes = diagnosticCodes;
        return _this;
    }
    ;
    return ChildError;
}(Error));
exports.ChildError = ChildError;
;
//# sourceMappingURL=ChildError.js.map