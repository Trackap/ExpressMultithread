/* Import express */
import express, { Request, Response, NextFunction } from "express";

/* Import Multithreaded Router */
import Multithreaded from "../../src/index";

/* Create express app */
const App = express();

Multithreaded.importControllers("./controllers");
Multithreaded.use("./middlewares/Error");

/* Use Multithreaded router */
App.use("/", Multithreaded.router);

/* Should not fall in this function */
App.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    console.log("Error fall to main thread -> bad");
    if (!res.headersSent) {
        res.status(400).send("Error fall into main thread")
    }
})

App.listen(3050, () => {
    console.info("Listening on http://localhost:3050")
})