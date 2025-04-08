import { prisma } from "../../config/prisma";
import { Request, Response } from "express";

export const getManegar = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const manager = await prisma.manager.findUnique({ where: { id} });
        if (!manager) {
            return res.status(404).json({ error: "Manager not found"});
        }
        res.json(manager);
    } catch (error) {
        res.status(500).json({ error: "Error fetching manager"});
    }
};
