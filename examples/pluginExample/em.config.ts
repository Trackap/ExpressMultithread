import { BaseConfig } from "../../src/types";

/* Define config */
const config : BaseConfig = {
    threadCount: 2, // Define thread count
    plugins: [ // Define plugin
        "./plugin/testPlugin.ts", // Add you plugin, it must be a .ts file which export as default a class which extends Plugin
        "./plugin/replacePlugin.ts"
    ]
};

export default config;