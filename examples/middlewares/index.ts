/* Import express */
import express from "express";
/* OPTIONNAL: Set thread count, can be done with env 'THREAD_COUNT' */
import Config from "../../src/config";
Config.threadCount = 2;

/* Import Multithreaded Router*/
import Multithreaded from "../../src/index";

/* Create express app */
const App = express();

/* Global middlewares, which runs on child thread */
Multithreaded.use(__dirname + "/expressJson.ts");
Multithreaded.use(__dirname + "/withArgs.ts", "Hello World !");

/* Import controllers which run on child threads */
Multithreaded.importControllers(__dirname + "/controllers");

/* Use Multithreaded router */
App.use("/", Multithreaded.router);

/* Start listening */
App.listen(3050, () => {
    console.info("Listening")
});