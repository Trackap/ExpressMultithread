# Express Multithread Router
Fast, light-weight and low dependency [Express.js](https://www.npmjs.com/package/express) multithreaded router.

[![Tests](https://github.com/Trackap/ExpressMultithread/actions/workflows/tests.yml/badge.svg)](https://github.com/Trackap/ExpressMultithread/actions/workflows/tests.yml)

Installation
-
This project require typescript and express.

```shell
npm i expressmultithread
```

Usage
-

1. Import express & multithreaded router :
```ts
// file index.ts
import express from 'express';
import Router from 'expressmultithread';
```

2. Create your express app, use router and import controllers :
```ts
// file index.ts
const App = express();
App.use("/", Router.router);
Router.importControllers("./controllers");
App.listen(3000, () => console.info("Listening on port 3000"));
```

3. Create a controllers directory and create a file 'example.ts' :
```ts
// file example.ts
import { controller, route } from 'expressmultithread/dist/decorators';
import { Request, Response } from 'express';

@controller()
export class ExampleController {
    @route("get", "/hello")
    public hello(_req: Request, res: Response) {
        res.status(200).send("Hello world!");
    }
}
```

4. Create a configuration file, at root of project :
```ts
// file em.config.ts
import { BaseConfig } from "expressmultithread/dist/types";

/* Define a config */
const config : BaseConfig = {
    threadCount: 2 // Define number of thread which run your web server
};

/* Export it as default*/
export default config;
```

Now you can run index.ts and open the following url http://localhost:3000/hello.
If you had trouble with this example you can see [example ReadMe](https://github.dev/Trackap/ExpressMultithread/tree/main/examples/exampleReadMe).

Too many threads created ?
You  just have to adjust it, with the configuration file.

API
-

##### Imports:
```ts
import Router from 'expressmultithread';
import { router, controller } from 'expressmultithread/dist/decorators';
import { ... } from 'expressmultithread/dist/types';
import Config from 'exressmultithread/dist/config';
```

##### Prototypes:
###### Config (Object):

`Properties :`
 - threadCount (property): Desired number of thread to launch (type: `number`);
 - plugins (property): Array of path to plugin file (type: `string[]`);
 - cleanRequest (method): Clean request function (type: `(req: Request) => Request`);

###### Router (Object):
`Properties :`
 - router (property): ExpressRouter to use. (type: `ExpressRouter`)

`Methods :`
 - importControllers (method): Define directory to fetch routes (type: `(path: string | string[]) => void`)
 - use (method): Use a middleware on all routes (type: `(path: string, ...args: Serializable[]) => void`)
 - unuse (method): Unuse a middleware or remove all used middlewares (type: `(middleware?: string, ...args: Serializable[]) => void`)

Usefull informations
-
The object request received in your functions is a light version of the original one, you can customize what's inside by following the [overrideReq example](https://github.dev/Trackap/ExpressMultithread/tree/main/examples/overrideReq).

The object response received in your functions is a total override object, it was overrided following the [Express API Documentation 4.x](https://expressjs.com/fr/4x/api.html#res).
Please note that transferred informations between threads must be serialisable data, res functions calls give content of the call to the main thread it means you can't pass functions in any res methods.

Middlewares passed in controller or route args, can't be error middleware, this is not handled by the multithreadedrouter, despite, you can handle errors with the main thread following the [errorHandling example](https://github.dev/Trackap/ExpressMultithread/tree/main/examples/errorHandling).

Please note that all path sent in args to plugins are resolve with the current working directory.

Config file
-
You can a file named `em.config.ts` which must export as default an object typed with the following type :
```ts
import { BaseConfig } from "expressmultithread/dist/types";
```
In this object you will be able to define different variables :
* threadCount (number): Number of child thread to launch
* cleanRequest ((req: Request) => Request): A function which let you pass more args in your Request variables
* plugins (string[]): Path array of plugin files
* overrideConsole (boolean): Enable/Disable identifier on console usages
* debug (boolean): Enable/Disable debug of module
* verbose (boolean): Enable/Disable extra logging in console
* restartThreads (boolean): Enable/Disable automatic restart of a new thread in case of crash

More examples
-
Check [examples folder](https://github.dev/Trackap/ExpressMultithread/tree/main/examples) for more examples

License
-
ExpressMultithread is [MIT Licensed](https://github.com/Trackap/ExpressMultithread/blob/main/LICENSE)