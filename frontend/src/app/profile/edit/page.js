"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";
import Btn from "../../../elements/btn";

export default function EditProfile() {
    const router = useRouter();
    const { gestor } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        image: null
    });

    useEffect(() => {
        if (gestor) {
            setFormData(prev => ({
                ...prev,
                name: gestor.name || "",
                email: gestor.email || ""
            }));
        }
    }, [gestor]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("email", formData.email);
            if (formData.image) {
                formDataToSend.append("image", formData.image);
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/managers/${gestor.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${gestor.token}`,
                },
                body: formDataToSend,
            });

            if (!response.ok) throw new Error("Falha ao atualizar perfil");

            router.push("/profile");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screenpy-8">
            <div className="max-w-2xl mx-auto rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-white mb-8">Editar Perfil</h1>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center mb-8">
                        <div className="relative w-32 h-32">
                            {(previewImage || gestor?.image_url) ? (
                                <Image
                                    src={previewImage || gestor?.image_url}
                                    alt="Preview"
                                    fill
                                    className="rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 text-4xl">👤</span>
                                </div>
                            )}
                            <label className="absolute bottom-0 right-0 bg-bee-purple-600 rounded-full p-2 cursor-pointer hover:bg-bee-purple-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Nome
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 px-4 py-2 border border-gray-300 text-white rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <Btn
                            type="submit"
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? "Salvando..." : "Salvar Alterações"}
                        </Btn>
                    </div>
                </form>
            </div>
        </div>
    );
}
