import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
    ) => {
        const uploadDir = path.join(__dirname, "..", "..", "uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
    ) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    },
});

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (
        _req: Request,
        file: Express.Multer.File,
        cb: multer.FileFilterCallback
    ) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Apenas imagens são permitidas"));
        }
    },
});

export interface MulterRequest extends Request {
    file?: Express.Multer.File;
    body: {
        imageUrl?: string;
    };
}

function isValidImageUrl(url: string): boolean {
    try {
        new URL(url);
        return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
    } catch {
        return false;
    }
}

async function updateProfileImage(
    entityType: "manager" | "driver",
    id: string,
    imageUrl: string,
    res: Response
) {
    try {
        const updatedEntity =
            entityType === "manager"
                ? await prisma.manager.update({
                      where: { id },
                      data: { profileImage: imageUrl },
                  })
                : await prisma.driver.update({
                      where: { id },
                      data: { profileImage: imageUrl },
                  });

        return res.json({
            success: true,
            imageUrl,
            [entityType]: {
                id: updatedEntity.id,
                name: updatedEntity.name,
                profileImage: updatedEntity.profileImage,
            },
        });
    } catch (error) {
        console.error(`Erro ao atualizar foto do ${entityType}:`, error);
        return res
            .status(500)
            .json({ error: `Erro ao atualizar imagem de perfil` });
    }
}

export const uploadManagerImage = async (req: MulterRequest, res: Response) => {
    const managerId = req.params.id;
    let imageUrl: string;

    if (req.body.imageUrl) {
        if (!isValidImageUrl(req.body.imageUrl)) {
            return res.status(400).json({ error: "URL de imagem inválida" });
        }
        imageUrl = req.body.imageUrl;
    } else if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    } else {
        return res.status(400).json({
            error: "Nenhuma imagem enviada - forneça um arquivo ou uma URL válida",
        });
    }

    return updateProfileImage("manager", managerId, imageUrl, res);
};

export const uploadDriverImage = async (req: MulterRequest, res: Response) => {
    const driverId = req.params.id;
    let imageUrl: string;

    if (req.body.imageUrl) {
        if (!isValidImageUrl(req.body.imageUrl)) {
            return res.status(400).json({ error: "URL de imagem inválida" });
        }
        imageUrl = req.body.imageUrl;
    } else if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    } else {
        return res.status(400).json({
            error: "Nenhuma imagem enviada - forneça um arquivo ou uma URL válida",
        });
    }

    return updateProfileImage("driver", driverId, imageUrl, res);
};

export const getManagerImage = async (req: Request, res: Response) => {
    try {
        const managerId = req.params.id;

        const manager = await prisma.manager.findUnique({
            where: { id: managerId },
            select: { profileImage: true },
        });

        if (!manager) {
            return res.status(404).json({ error: "Gestor não encontrado" });
        }

        res.json({ profileImage: manager.profileImage });
    } catch (error) {
        console.error("Erro ao buscar imagem do gestor:", error);
        res.status(500).json({ error: "Erro ao buscar imagem de perfil" });
    }
};

export const getDriverImage = async (req: Request, res: Response) => {
    try {
        const driverId = req.params.id;

        const driver = await prisma.driver.findUnique({
            where: { id: driverId },
            select: { profileImage: true },
        });

        if (!driver) {
            return res.status(404).json({ error: "Motorista não encontrado" });
        }

        res.json({ profileImage: driver.profileImage });
    } catch (error) {
        console.error("Erro ao buscar imagem do motorista:", error);
        res.status(500).json({ error: "Erro ao buscar imagem de perfil" });
    }
};
