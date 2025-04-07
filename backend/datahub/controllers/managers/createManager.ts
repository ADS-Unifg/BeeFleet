import { prisma } from "../../config/prisma";
import { Response } from "express";
import { CreateManagerRequest } from "../../schemas/managerInterface";

export const createManager = async (
    req: CreateManagerRequest,
    res: Response
) => {
    try {
        const { name, email, password, imageUrl } = req.body;

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

        let profileImage = "";

        if (req.file) {
            profileImage = `/uploads/${req.file.filename}`;
        } else if (imageUrl) {
            profileImage = imageUrl;
        }

        const manager = await prisma.manager.create({
            data: {
                name,
                email,
                password: password,
                profileImage,
            },
        });

        const { password: _, ...secureManager } = manager;

        res.status(201).json({
            success: true,
            message: "Manager created successfully",
            data: secureManager,
        });
    } catch (error: any) {
        console.error("Error creating manager:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create manager",
            error: error.message,
        });
    }
};
