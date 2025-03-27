import { prisma } from "../../config/prisma.js";
import { parseISO } from "date-fns";

export const createManager = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "Missing required fields: name, email, and password are required",
            });
        }

        const existingManager = await prisma.manager.findUnique({
            where: { email },
        });

        if (existingManager) {
            return res.status(400).json({
                success: false,
                message: "Manager with this email already exists",
            });
        }

        const manager = await prisma.manager.create({
            data: {
                name,
                email,
                password: password,
            },
        });

        const { password: _, ...secureManager } = manager;

        res.status(201).json({
            success: true,
            message: "Manager created successfully",
            data: secureManager,
        });
    } catch (error) {
        console.error("Error creating manager:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create manager",
            error: error.message,
        });
    }
};

export const getVehicleUsageReport = async (req, res) => {
    try {
        const { startDate, endDate, carId, managerId } = req.query;

        // Validate input
        if (!startDate || !endDate) {
            return res
                .status(400)
                .json({ error: "Start and end dates are required" });
        }

        // Parse dates
        const parsedStartDate = parseISO(startDate);
        const parsedEndDate = parseISO(endDate);

        // Build query conditions
        const whereCondition = {
            managerId,
            eventType: "RETURN",
            createdAt: {
                gte: parsedStartDate,
                lte: parsedEndDate,
            },
            ...(carId && { carId }), // Optional car filter
        };

        // Fetch events with related information
        const events = await prisma.event.findMany({
            where: whereCondition,
            include: {
                car: true,
                driver: true,
                manager: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        // Aggregate report data
        const report = {
            totalEvents: events.length,
            vehicles: events.reduce((acc, event) => {
                const existingVehicle = acc.find(
                    (v) => v.carId === event.carId
                );
                if (existingVehicle) {
                    existingVehicle.usageCount++;
                    existingVehicle.totalOdometer += event.odometer;
                } else {
                    acc.push({
                        carId: event.carId,
                        plate: event.car.plate,
                        model: event.car.model,
                        usageCount: 1,
                        totalOdometer: event.odometer,
                    });
                }
                return acc;
            }, []),
            startDate: parsedStartDate,
            endDate: parsedEndDate,
        };

        res.json(report);
    } catch (error) {
        console.error("Vehicle usage report error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getDriverUsageReport = async (req, res) => {
    try {
        const { startDate, endDate, driverId, managerId } = req.query;

        // Validate input
        if (!startDate || !endDate) {
            return res
                .status(400)
                .json({ error: "Start and end dates are required" });
        }

        // Parse dates
        const parsedStartDate = parseISO(startDate);
        const parsedEndDate = parseISO(endDate);

        // Build query conditions
        const whereCondition = {
            managerId,
            eventType: "RETURN",
            createdAt: {
                gte: parsedStartDate,
                lte: parsedEndDate,
            },
            ...(driverId && { driverId }), // Optional driver filter
        };

        // Fetch events with related information
        const events = await prisma.event.findMany({
            where: whereCondition,
            include: {
                car: true,
                driver: true,
                manager: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        // Aggregate report data
        const report = {
            totalEvents: events.length,
            drivers: events
                .reduce((acc, event) => {
                    const existingDriver = acc.find(
                        (d) => d.driverId === event.driverId
                    );
                    if (existingDriver) {
                        existingDriver.usageCount++;
                        existingDriver.vehicles.add(event.carId);
                        existingDriver.totalOdometer += event.odometer;
                    } else {
                        acc.push({
                            driverId: event.driverId,
                            name: event.driver.name,
                            phone: event.driver.phone,
                            usageCount: 1,
                            vehicles: new Set([event.carId]),
                            totalOdometer: event.odometer,
                        });
                    }
                    return acc;
                }, [])
                .map((driver) => ({
                    ...driver,
                    vehicles: Array.from(driver.vehicles),
                })),
        };

        res.json(report);
    } catch (error) {
        console.error("Driver usage report error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getAllCarsUsageReport = async (req, res) => {
    try {
        const { managerId } = req.query;

        if (!managerId) {
            return res.status(400).json({ error: "Manager ID is required" });
        }

        const cars = await prisma.car.findMany({
            where: { managerId },
            include: {
                events: {
                    where: { eventType: "RETURN" },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        const carsReport = cars.map((car) => {
            const totalUsageTimes = car.events.length;

            const totalOdometerChange = car.events.reduce((acc, event) => {
                return acc + event.odometer;
            }, 0);

            const lastUsed =
                car.events.length > 0 ? car.events[0].createdAt : null;

            const averageDailyUsage =
                totalUsageTimes > 0
                    ? (totalOdometerChange / totalUsageTimes).toFixed(2)
                    : 0;

            return {
                id: car.id,
                plate: car.plate,
                model: car.model,
                year: car.year,
                color: car.color,
                status: car.status,
                totalUsageTimes,
                totalOdometerChange,
                lastUsed,
                averageDailyUsage,
                currentOdometer: car.odometer,
            };
        });

        res.json({
            totalCars: carsReport.length,
            cars: carsReport,
        });
    } catch (error) {
        console.error("All Cars Usage Report error:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getAllDriversUsageReport = async (req, res) => {
    try {
        const { managerId } = req.query;

        // Validate managerId
        if (!managerId) {
            return res.status(400).json({ error: "Manager ID is required" });
        }

        // Fetch all drivers for the manager with their usage history
        const drivers = await prisma.driver.findMany({
            where: { managerId },
            include: {
                events: {
                    where: { eventType: "RETURN" },
                    include: { car: true },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        // Calculate usage statistics for each driver
        const driversReport = drivers.map((driver) => {
            // Calculate total usage times
            const totalUsageTimes = driver.events.length;

            // Collect unique cars used
            const uniqueCars = new Set(
                driver.events.map((event) => event.car.id)
            );

            // Calculate total distance driven
            const totalOdometerChange = driver.events.reduce((acc, event) => {
                return acc + event.odometer;
            }, 0);

            // Find the most recent usage
            const lastUsed =
                driver.events.length > 0 ? driver.events[0].createdAt : null;

            // Collect detailed car usage
            const carUsageDetails = Array.from(uniqueCars).map((carId) => {
                const carEvents = driver.events.filter(
                    (event) => event.car.id === carId
                );
                const car = carEvents[0].car;

                return {
                    carId: car.id,
                    plate: car.plate,
                    model: car.model,
                    usageTimes: carEvents.length,
                    totalOdometerChange: carEvents.reduce(
                        (acc, event) => acc + event.odometer,
                        0
                    ),
                };
            });

            return {
                id: driver.id,
                name: driver.name,
                phone: driver.phone,
                license: driver.license,
                totalUsageTimes,
                uniqueCarsUsed: uniqueCars.size,
                totalOdometerChange,
                lastUsed,
                carUsageDetails,
            };
        });

        res.json({
            totalDrivers: driversReport.length,
            drivers: driversReport,
        });
    } catch (error) {
        console.error("All Drivers Usage Report error:", error);
        res.status(500).json({ error: error.message });
    }
};
