/* Import express */
import express, { Response, NextFunction } from "express";
/* OPTIONNAL: Set thread count, can be done with env 'THREAD_COUNT' */
import Config from "../../src/config";
Config.threadCount = 2;

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

/* By default, req has the following properties :
    body,
    params,
    query,
    headers,
    baseUrl,
    path,
    method
If you want to add more, you just have to override Config.cleanRequest
as shown below */
/* Override cleanRequest to keep req.hello */
Config.cleanRequest = (req: RequestWithHello) => {
    return {
        hello: req.hello
    } as RequestWithHello;
}
/* Use Multithreaded router */
App.use("/", Multithreaded.router);

/* Start listening */
App.listen(3050, () => {
    console.info("Listening")
});