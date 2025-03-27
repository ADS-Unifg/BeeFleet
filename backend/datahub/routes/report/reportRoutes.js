import express from "express";
import { createReport } from "../../controllers/report/createReport";

const reportRoutes = express.Router();

reportRoutes.post("/report", createReport);

export default reportRoutes;
