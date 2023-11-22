import "reflect-metadata";
import express from "express";
import cors from "cors";
import { InversifyExpressServer } from "inversify-express-utils";

import loadContainer from "./inversify.config";

loadContainer().then(container => {
    const inversifyWrapper = new InversifyExpressServer(container);
    inversifyWrapper.setConfig(app => {
        app.use(express.json());
        app.use(cors({
            origin: "http://localhost:1234"
        }));
    });

    inversifyWrapper.setErrorConfig(app => {
        app.use((error, req, res, next) => {
            if (error.type == "DomainError") {
                return res.status(409).statusMessage(error.message);
            }
        });
    })

    const app = inversifyWrapper.build();

    app.listen(3000, () => {
        console.log("The server is up and running!");
    });
});