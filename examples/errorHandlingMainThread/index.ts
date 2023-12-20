/* Import express */
import express, { Request, Response, NextFunction } from "express";

/* Import Multithreaded Router*/
import Multithreaded from "../../src/index";

/* Create express app */
const App = express();

/* Import controllers which run on child threads */
Multithreaded.importControllers("./controllers");

/* Use Multithreaded router */
App.use("/", Multithreaded.router);

/* 404 Handling */
App.all("*", (_req : Request, res : Response) => {
    res.status(404).send("404, Not Found");
});

/* Error handling */
App.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }
    if (err.status && err.message) {
        return res.status(err.status).send(err.message);
    } else {
        return res.status(500).send("500, Internal Server Error");
    }
});

/* Start listening */
App.listen(3050, () => {
    console.info("Listening on http://localhost:3050")
});