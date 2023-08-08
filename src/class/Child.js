const path = require('path');
require('ts-node').register();
// register({
//     project: path.resolve(process.cwd(), 'tsconfig.json')
// });
const { ChildError } =  require(path.resolve(__filename.replace(".js", "Error.ts")));
try {
    require(path.resolve(__filename.replace(".js", ".ts")));
} catch (e) {
    throw new ChildError(e.diagnosticText, e.diagnosticCodes);
}