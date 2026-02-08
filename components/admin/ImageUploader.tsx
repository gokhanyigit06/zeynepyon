"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";

interface ImageUploaderProps {
    label: string;
    value: string;
    onChange: (url: string) => void;
}

export default function ImageUploader({ label, value, onChange }: ImageUploaderProps) {
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                onChange(data.url);
            }
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            <div className="flex items-center gap-4">
                {value && (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 group">
                        <Image src={value} alt="Preview" fill className="object-cover" />
                        <button
                            type="button"
                            onClick={() => onChange("")}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <div className="flex-1">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {loading ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                                </>
                            )}
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={loading} />
                    </label>
                </div>
            </div>
        </div>
    );
}
