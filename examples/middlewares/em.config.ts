import { BaseConfig } from "../../src/types";

/* Define a config */
const config : BaseConfig = {
    threadCount: 2, // Define number of thread which run your web server
    tsconfigPath: "../../tsconfig.json"

};

/* Export it as default*/
export default config;