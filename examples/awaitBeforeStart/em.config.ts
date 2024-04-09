import { BaseConfig } from "../../src/types";

/* Define a config */
const config : BaseConfig = {
    threadCount: 1, // Define number of thread which run your web server
    tsconfigPath: "../../tsconfig.json",
    restartThreads: false,
    awaitable: new Promise<void>((resolve) => { // Will make start your server after 5 seconds
        setTimeout(() => {
            console.info("Promise resolved")
            resolve();
        }, 5000);
    })
};

/* Export it as default*/
export default config;