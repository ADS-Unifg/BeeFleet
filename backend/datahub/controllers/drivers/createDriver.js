import { prisma } from "../../config/prisma.js";

export const createDriver = async (req, res) => {
    try {
        const { name, phone, license, managerId } = req.body;

        if (!name || !phone || !license || !managerId) {
            return res.status(400).json({
                success: false,
                message:
                    "Missing required fields: name, phone, license, and managerId are required",
            });
        }

        const driver = await prisma.driver.create({
            data: {
                name,
                phone,
                license,
                managerId,
            },
        });

        res.status(201).json({
            success: true,
            message: "Driver created successfully",
            data: driver,
        });
    } catch (error) {
        console.error("Error creating driver:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create driver",
            error: error.message,
        });
    }
};
