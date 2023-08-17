import Config from '../src/class/Config';
Config.threadCount = 1;
import { Multithreaded } from '../src/class/Router';
import { expect } from 'chai';
import Parent from '../src/class/Parent';
import request from 'supertest';
import express from 'express';

let App = express();

describe('Router tests', () => {

    beforeAll((done) => {
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

    describe('.use tests', () => {
        const path = __dirname + "/samples/middlewares/withArgs.ts";
        const example = "ExampleHeader";
        expect(Parent?.middlewares.length).to.be.equal(0);
        Multithreaded.use(path, example);
        expect(Parent?.middlewares.length).to.be.equal(1);
        expect(Parent?.middlewares[0].path).to.be.equal(path);
        expect(Parent?.middlewares[0].opts).to.be.deep.equal([example]);
    });

    describe('.unuse tests', () => {
        expect(Parent?.middlewares.length).to.be.equal(1);
        const path = __dirname + "/samples/middlewares/expressJson.ts";
        Multithreaded.use(path);
        expect(Parent?.middlewares.length).to.be.equal(2);
        Multithreaded.unuse(path);
        expect(Parent?.middlewares.length).to.be.equal(1);
        expect(Parent?.middlewares.findIndex((m) => m.path === path)).to.be.equal(-1);
        Multithreaded.use(path);
        expect(Parent?.middlewares.length).to.be.equal(2);
        Multithreaded.unuse();
        expect(Parent?.middlewares.length).to.be.equal(0);
    })

    describe('Test route', () => {
        it("should return 200", (done) => {
            request(App)
                .get("/")
                .expect(200, done);
        });
    });
    
    afterAll(() => {
        Parent!.close();
    })
});