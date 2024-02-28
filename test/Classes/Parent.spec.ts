import { expect } from "chai";
import Parent from "../../src/class/Parent";
import Router from "../../src/class/Router";
import express from "express";
import request from "supertest";

if (!Parent)
    throw new Error("Code executed in child thread ");

let App = express();

describe("Parent tests", () => {
    beforeAll((done) => {
        Router.importControllers(`${__dirname}/../samples`)
        App.use("/", Router.router);
        setTimeout(() => done(), 2000);
    });

    describe("source tests", () => {
        it("should be sources imported", () => {
            expect(Parent!._sourcesList.length).to.be.equal(1);
        });

        it("should be express router" , () => {
            expect(Router.router).to.be.an("function");
        });
    });

    describe("requests tests", () => {
        it("should get correctly", () => {
            return request(App)
                .get("/")
                .expect(200)
                .then((response) => {
                    expect(response.text).to.be.equal("Hello World!");
                });
        });

        it("should post correctly", () => {
            return request(App)
                .post("/")
                .expect(201)
                .then((response) => {
                    expect(response.text).to.be.equal("Hi!");
                });
        });

        it("should not make crash the worker", () => {
            return request(App)
                .get("/crash")
                .expect(500)
                .then((response) => {
                    expect(Parent!._inc).to.be.equal(1);
                });
        });
    });

    afterAll(() => {
        Parent!.close();
    });
});