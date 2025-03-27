import express from "express";
import driverRoutes from "./drivers/driversRoutes.js";
import managerRoutes from "./managers/managersRoutes.js";
import carRoutes from "./cars/carsRoutes.js";
import eventRoutes from "./events/eventRoutes.js";

const router = express.Router();

router.use(driverRoutes);
router.use(managerRoutes);

router.use(carRoutes);
router.use(eventRoutes);

export default router;
