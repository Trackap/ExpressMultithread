import { RequestWithHello } from "./declaration";
import { BaseConfig } from "../../src/types";

/* Define a config */
const config : BaseConfig = {
    threadCount: 2,

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
    cleanRequest: (req: RequestWithHello) => {
        return {
            hello: req.hello
        } as RequestWithHello;
    },
    tsconfigPath: "../../tsconfig.json"
};

/* Export it as default*/
export default config;