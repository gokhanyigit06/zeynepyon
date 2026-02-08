"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Image from "next/image";

interface HeaderProps {
    logoText?: string;
    logoUrl?: string; // Add optional logoUrl
    menuItems?: Array<{ name: string; href: string }>;
}

import { usePathname } from "next/navigation";

export default function Header({ logoText = "Zeynep Yön", logoUrl, menuItems = [] }: HeaderProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    if (pathname?.startsWith("/admin")) return null;

    // Fallback if no menu items provided
    const items = menuItems.length > 0 ? menuItems : [
        { name: "NEWS", href: "/news" },
        { name: "CONTACT", href: "/contact" },
    ];

    return (
        <header className="fixed w-full z-50 top-0 left-0 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                    {logoUrl ? (
                        <div className="relative w-32 h-10">
                            <Image
                                src={logoUrl}
                                alt={logoText}
                                fill
                                className="object-contain object-left"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    ) : (
                        <span className="text-xl font-bold tracking-widest uppercase text-black">
                            {logoText}
                        </span>
                    )}
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    {items.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium tracking-wide text-gray-800 hover:text-black transition-colors relative group"
                        >
                            {item.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full duration-300"></span>
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-black focus:outline-none"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg"
                    >
                        <nav className="flex flex-col p-6 space-y-4">
                            {items.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-lg font-medium tracking-wide text-gray-800 hover:text-black transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
