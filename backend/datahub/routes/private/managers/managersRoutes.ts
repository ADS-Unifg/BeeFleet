import express, { Router } from "express";
import { createManager } from "../../../controllers/managers/createManager";
import { CreateManagerRequest } from "../../../schemas/managerInterface";
import {
    upload,
    uploadManagerImage,
    MulterRequest,
} from "../../../controllers/managers/uploadPhotoManager";

const managerRoutes: Router = express.Router();

managerRoutes.post(
    "/managers/create",
    (req, res, next) => {
        if (req.headers["content-type"]?.startsWith("multipart/form-data")) {
            return upload.single("profileImage")(req, res, next);
        }

        next();
    },
    async (req, res, next) => {
        try {
            await createManager(req as CreateManagerRequest, res);
        } catch (error) {
            next(error);
        }
    }
);

managerRoutes.put(
    "/managers/:id/profile-image",
    (req, res, next) => {
        if (req.headers["content-type"]?.startsWith("multipart/form-data")) {
            return upload.single("profileImage")(req, res, next);
        }
        next();
    },
    async (req, res, next) => {
        try {
            await uploadManagerImage(req as MulterRequest, res);
        } catch (error) {
            next(error);
        }
    }
);

export default managerRoutes;
