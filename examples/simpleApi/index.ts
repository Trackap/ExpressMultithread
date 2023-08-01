/* Modules */
import express from "express";
import Multithreaded from "../../src/index";

const App = express();
Multithreaded.use((_req, _res, next) => {
    console.log("global middleware");
    next();
});
Multithreaded.importControllers(__dirname);
App.use("/", Multithreaded.router);


App.listen(3000, () => {
    console.info("Listening")
});
