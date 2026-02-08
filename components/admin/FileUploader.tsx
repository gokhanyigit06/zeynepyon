"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X, Music } from "lucide-react";

interface FileUploaderProps {
    label: string;
    value: string;
    onChange: (url: string) => void;
    accept?: string;
}

export default function FileUploader({ label, value, onChange, accept = "image/*" }: FileUploaderProps) {
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

    const isAudio = accept.includes("audio");

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            <div className="flex items-center gap-4">
                {value && (
                    <div className={`relative ${isAudio ? 'w-full h-16' : 'w-32 h-32'} rounded-lg overflow-hidden border border-gray-200 group bg-gray-50 flex items-center justify-center`}>
                        {isAudio ? (
                            <div className="flex items-center gap-2 px-4 w-full">
                                <Music className="w-6 h-6 text-gray-400" />
                                <audio src={value} controls className="w-full h-8" />
                            </div>
                        ) : (
                            <Image src={value} alt="Preview" fill className="object-cover" />
                        )}

                        <button
                            type="button"
                            onClick={() => onChange("")}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {!value && (
                    <div className="flex-1">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {loading ? (
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                                        <p className="text-xs text-gray-500">{isAudio ? "MP3, WAV" : "PNG, JPG"}</p>
                                    </>
                                )}
                            </div>
                            <input type="file" className="hidden" accept={accept} onChange={handleFileChange} disabled={loading} />
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
}
