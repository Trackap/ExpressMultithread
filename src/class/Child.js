const path = require('path');
require('ts-node').register({
    project: path.resolve(process.cwd(), 'tsconfig.json')
});
try {
    require(path.resolve(__filename.replace(".js", ".ts")));
} catch (e) {
    throw {
        diagnosticText: e.diagnosticText,
        diagnosticCodes: e.diagnosticCodes
    };
}