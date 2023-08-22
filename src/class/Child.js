const { resolve } = require('path');
require('ts-node').register(require(resolve(process.cwd(), "tsconfig.json")));
try {
    require(resolve(__filename.replace(".js", ".ts")));
} catch (e) {
    throw new Error(e);
}