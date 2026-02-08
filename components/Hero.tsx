"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero({ data }: { data: any }) {
    const [showBio, setShowBio] = useState(false);

    return (
        <section className="flex flex-col md:flex-row items-center justify-between gap-12 py-12 md:py-20">
            {/* Left Content */}
            <div className="flex-1 space-y-6 md:pr-12">
                <h1 className="text-4xl md:text-5xl font-serif text-gray-900 tracking-tight leading-tight">
                    {data.title}
                </h1>

                <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                    <p className="font-light">
                        {data.description_en}
                    </p>
                    <p className="font-light">
                        {data.description_tr}
                    </p>

                    <AnimatePresence>
                        {showBio && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <p className="font-light text-gray-700 bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400 mt-4 text-base">
                                    {data.extended_bio || "Biography details not available."}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <button
                        onClick={() => setShowBio(!showBio)}
                        className="px-8 py-3 bg-[#EAB308] hover:bg-[#D9A507] text-black font-medium text-sm rounded-full transition-all shadow-md hover:shadow-lg transform active:scale-95"
                    >
                        {showBio ? "Hide Bio" : "Learn More"}
                    </button>
                    <Link
                        href="/contact"
                        className="px-8 py-3 border border-gray-300 hover:border-gray-500 hover:bg-gray-50 text-gray-800 font-medium text-sm rounded-full transition-all active:scale-95"
                    >
                        Contact
                    </Link>
                </div>
            </div>

            {/* Right Image */}
            <div className="flex-1 w-full flex justify-center md:justify-end">
                <div className="relative w-full max-w-[500px] aspect-square rounded-[2rem] overflow-hidden bg-gray-200 shadow-2xl transform hover:scale-[1.01] transition-transform duration-500 group">
                    <Image
                        src={data.imageUrl}
                        alt={data.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}
