/* Import express */
import express from "express";
/* OPTIONNAL: Set thread count, can be done with env 'THREAD_COUNT' */
import Config from "../../src/class/Config";
Config.threadCount = 2;

/* Import Multithreaded Router*/
import Multithreaded from "../../src/index";

/* Create express app */
const App = express();
/* Route which run on main thread */
App.get("/main", (_req: any, res: any, _next: any) => {
    res.send("I'm  running on main thread !");
});

/* Import controllers with a directory, will walk recursively on it and import all controllers & methods */
Multithreaded.importControllers(__dirname + "/controllers");

/* Use Multithreaded router */
App.use("/", Multithreaded.router);

/* Start listening */
App.listen(3050, () => {
    console.info("Listening")
});