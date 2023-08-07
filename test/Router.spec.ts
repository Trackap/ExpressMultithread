import Config from '../src/class/Config';
Config.threadCount = 1;
import { Multithreaded } from '../src/class/Router';
import { expect } from 'chai';
import Parent from '../src/class/Parent';
// import request from 'supertest';
import express from 'express';

let App = express();

describe('Router tests', () => {

    before((done) => {
        Multithreaded.importControllers(`${__dirname}/samples`);
        App.use("/", Multithreaded.router);
        setTimeout(() => done(), 2000);
    })

    describe('importControllers tests', () => {
        it("should have source", () => {
            expect(Parent?.sourcesList.length).to.equal(1);
        });

        it("should return express router" , () => {
            expect(Multithreaded.router).to.be.an("function");
        });
    });

    describe('Test route', () => {
        // it("should return 200", (done) => {
        //     request(App)
        //         .get("/")
        //         // .expect(200, done)
        //         .end(function (err, res) {
        //             if (err)
        //                 throw err;
        //             console.info(res);
        //             done()
        //         });
        // });
    });
    
    after(() => {
        Parent!.close();
    })
});