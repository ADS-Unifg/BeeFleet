import express, { Router } from "express";
import { createManager } from "../../../controllers/managers/createManager";
import { getManager } from "../../../controllers/managers/getAllManager";
import { getAllManagers } from "../../../controllers/managers/getAllManager";
import { putManager } from "../../../controllers/managers/putManager";
import { deleteManager } from "../../../controllers/managers/deleteManager";

const managerRoutes: Router = express.Router();

managerRoutes.post("/managers/create", async (req, res, next) => {
    try {
        await createManager(req, res);
    } catch (error) {
        next(error);
    }
});

managerRoutes.get("/managers/:id", async (req, res, next) => {
    try {
        await getManager(req, res);
    } catch (error) {
        next(error);
    }
});

managerRoutes.get("/managers", async (req, res, next) => {
    try {
        await getAllManagers(req, res);
    } catch (error) {
        next(error);
    }
});

managerRoutes.put("/managers/:id", async (req, res, next) => {
    try {
        await putManager(req, res);
    } catch (error) {
        next(error);
    }
});

managerRoutes.delete("/managers/:id", async (req, res, next) => {
    try {
        await deleteManager(req, res);
    } catch (error) {
        next(error);
    }
});

export default managerRoutes;
