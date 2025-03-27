import { prisma } from "../../config/prisma.js";
import { differenceInHours } from "date-fns";

export const createCheckoutEvent = async (req, res) => {
    try {
        const { eventType, odometer, managerId, driverId, carId } = req.body;

        if (eventType === "CHECKOUT") {
            // Check car availability
            const car = await prisma.car.findUnique({
                where: { id: carId },
            });

            if (!car) {
                return res.status(404).json({ error: "Car not found" });
            }

            if (!car.isAvailable || car.status !== "AVAILABLE") {
                return res
                    .status(400)
                    .json({ error: "Car is not available for checkout" });
            }

            // Check driver availability
            const driver = await prisma.driver.findUnique({
                where: { id: driverId },
            });

            if (!driver) {
                return res.status(404).json({ error: "Driver not found" });
            }

            if (!driver.isAvailable) {
                return res
                    .status(400)
                    .json({ error: "Driver is not available for checkout" });
            }

            // Create checkout event
            const event = await prisma.event.create({
                data: {
                    eventType,
                    odometer,
                    managerId,
                    driverId,
                    carId,
                    status: "ACTIVE",
                },
            });

            // Update car and driver to unavailable
            await prisma.car.update({
                where: { id: carId },
                data: {
                    status: "IN_USE",
                    isAvailable: false,
                },
            });

            await prisma.driver.update({
                where: { id: driverId },
                data: {
                    isAvailable: false,
                },
            });

            res.json(event);
        } else if (eventType === "RETURN") {
            const { checkoutEventId } = req.body;

            if (!checkoutEventId) {
                return res
                    .status(400)
                    .json({ error: "Checkout event ID is required" });
            }

            // Find the checkout event
            const checkoutEvent = await prisma.event.findFirst({
                where: {
                    id: checkoutEventId,
                    eventType: "CHECKOUT",
                },
            });

            if (!checkoutEvent) {
                return res
                    .status(404)
                    .json({ error: "Checkout event not found" });
            }

            // Validate that the return event matches the original checkout event
            if (
                checkoutEvent.carId !== carId ||
                checkoutEvent.driverId !== driverId
            ) {
                return res
                    .status(400)
                    .json({
                        error: "Return event does not match original checkout event",
                    });
            }

            // Create return event
            const returnEvent = await prisma.event.create({
                data: {
                    eventType: "RETURN",
                    odometer,
                    managerId,
                    driverId,
                    carId,
                    checkoutEventId,
                    status: "COMPLETED",
                    endedAt: new Date(),
                },
            });

            // Update the original checkout event
            await prisma.event.update({
                where: { id: checkoutEventId },
                data: {
                    status: "COMPLETED",
                    endedAt: new Date(),
                },
            });

            // Calculate duration
            const duration = differenceInHours(
                new Date(),
                checkoutEvent.createdAt
            );

            // Create a report
            const report = await prisma.report.create({
                data: {
                    managerId,
                    driverId,
                    carId,
                    eventType: "RETURN",
                    startDate: checkoutEvent.createdAt,
                    endDate: new Date(),
                },
            });

            // Update car and driver back to available
            await prisma.car.update({
                where: { id: carId },
                data: {
                    status: "AVAILABLE",
                    isAvailable: true,
                },
            });

            await prisma.driver.update({
                where: { id: driverId },
                data: {
                    isAvailable: true,
                },
            });

            res.json({
                event: returnEvent,
                report,
                duration: `${duration} hours`,
            });
        } else {
            res.status(400).json({ error: "Invalid event type" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
