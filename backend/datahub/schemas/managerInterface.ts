import { Request, Response } from "express";
export interface LoginRequestBody {
    email: string;
    password: string;
}

export interface Manager {
    id: string;
    name: string;
    email: string;
    password: string;
    imageUrl?: string;
}

export interface CreateManagerRequest extends Request<{}, {}, Manager> {
    file?: Express.Multer.File;
}
