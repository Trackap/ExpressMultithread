"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanRequest = void 0;
function cleanRequest(req) {
    return {
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers,
        baseUrl: req.baseUrl,
        path: req.route.path,
        method: req.method
    };
}
exports.cleanRequest = cleanRequest;
;
//# sourceMappingURL=cleanRequest.js.map