import { prisma } from "../../config/prisma.js";

export const createCar = async (req, res) => {
    try {
        const { plate, model, year, color, managerId } = req.body;
        const car = await prisma.car.create({
            data: { plate, model, year, color, managerId },
        });
        res.json(car);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
