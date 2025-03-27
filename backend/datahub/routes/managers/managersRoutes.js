import express from "express";
import { createManager } from "../../controllers/managers/createManager.js";
import { getVehicleUsageReport } from "../../controllers/managers/createManager.js";
import { getDriverUsageReport } from "../../controllers/managers/createManager.js";
import { getAllCarsUsageReport } from "../../controllers/managers/createManager.js";
import { getAllDriversUsageReport } from "../../controllers/managers/createManager.js";

const managerRoutes = express.Router();

managerRoutes.post("/managers", createManager);
managerRoutes.get("/vehicle-usage", getVehicleUsageReport);
managerRoutes.get("/driver-usage", getDriverUsageReport);

managerRoutes.get("/all-cars", getAllCarsUsageReport);
managerRoutes.get("/all-drivers", getAllDriversUsageReport);

export default managerRoutes;
