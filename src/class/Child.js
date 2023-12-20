const { resolve } = require('path');
const registered = require('ts-node').register();
const { Config } = require("../config");
registered.enabled(false);
require('ts-node').register(require(Config.tsconfigPath));
try {
    require(resolve(__filename.replace(".js", ".ts")));
} catch (e) {
    throw new Error(e);
}