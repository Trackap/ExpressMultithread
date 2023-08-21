import express from 'express';
import Router from '../../src/index';

const App = express();
App.use("/", Router.router);
Router.importControllers("./controllers");
App.listen(3000, () => console.info("Listening on port 3000"));