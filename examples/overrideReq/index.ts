/* Import express */
import express, { Response, NextFunction } from "express";

/* Import Multithreaded Router*/
import Multithreaded from "../../src/index";
import { RequestWithHello } from "./declaration";

/* Create express app */
const App = express();

/* Global middleware, which runs on MainThread and fill req.hello */
App.use([
    (req: RequestWithHello, _res: Response, next: NextFunction) => {
        req.hello = "Hello World!";
        next();
    }
]);

/* Import controllers which run on child threads */
Multithreaded.importControllers(__dirname + "/controllers");


/* Use Multithreaded router */
App.use("/", Multithreaded.router);

/* Start listening */
App.listen(3050, () => {
    console.info("Listening on http://localhost:3050");
});