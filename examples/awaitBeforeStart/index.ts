/* Import express */
import express from "express";

/* Import Multithreaded Router */
import Multithreaded from "../../src/index";

/* Create express app */
const App = express();

Multithreaded.importControllers("./controllers");

/* Use Multithreaded router */
App.use("/", Multithreaded.router);

App.listen(3050, () => {
    console.info("Listening on http://localhost:3050")
})