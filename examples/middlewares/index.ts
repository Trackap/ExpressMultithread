/* Import express */
import express from "express";

/* Import Multithreaded Router*/
import Multithreaded from "../../src/index";

/* Create express app */
const App = express();

/* Global middlewares, which runs on child thread */
Multithreaded.use("./expressJson.ts");
Multithreaded.use("./withArgs.ts", "Hello World !");

/* Import controllers which run on child threads */
Multithreaded.importControllers("./controllers");

/* Use Multithreaded router */
App.use("/", Multithreaded.router);

/* Start listening */
App.listen(3050, () => {
    console.info("Listening on http://localhost:3050");
});