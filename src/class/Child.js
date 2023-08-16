const path = require('path');
require('ts-node').register();
try {
    require(path.resolve(__filename.replace(".js", ".ts")));
} catch (e) {
    throw new Error(e);
}