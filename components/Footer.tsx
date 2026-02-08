"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BookOpen } from "lucide-react";

interface FooterProps {
    stores?: Array<{ name: string; url: string }>;
    data?: {
        logoText?: string;
        logoUrl?: string;
        buttonText?: string;
        buttonUrl?: string;
    };
}

export default function Footer({ stores = [], data = {} }: FooterProps) {
    const pathname = usePathname();
    if (pathname?.startsWith("/admin")) return null;

    const { logoText = "Zeynep Yön", logoUrl, buttonText = "Buy book", buttonUrl = "#" } = data;

    return (
        <footer className="bg-stone-100 py-16 px-6 mt-20">
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">

                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-black">
                            {logoUrl ? (
                                <div className="relative w-32 h-10">
                                    <Image src={logoUrl} alt={logoText} fill className="object-contain object-left" />
                                </div>
                            ) : (
                                <>
                                    <BookOpen className="w-6 h-6" />
                                    <span>{logoText}</span>
                                </>
                            )}
                        </Link>
                    </div>

                    {/* Links Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24 w-full md:w-auto">

                        {/* Column 1 */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Explore</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><Link href="/about" className="hover:text-black transition-colors">About</Link></li>
                                <li><Link href="/writings" className="hover:text-black transition-colors">Writings</Link></li>
                                <li><Link href="/media" className="hover:text-black transition-colors">Media</Link></li>
                                <li><Link href="/contact" className="hover:text-black transition-colors">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Where to buy</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {stores.length > 0 ? (
                                    stores.map((store) => (
                                        <li key={store.name}>
                                            <a href={store.url || "#"} className="hover:text-black transition-colors">{store.name}</a>
                                        </li>
                                    ))
                                ) : (
                                    <>
                                        <li><a href="#" className="hover:text-black transition-colors">Amazon</a></li>
                                        <li><a href="#" className="hover:text-black transition-colors">Apple Books</a></li>
                                        <li><a href="#" className="hover:text-black transition-colors">Barnes & Noble</a></li>
                                        <li><a href="#" className="hover:text-black transition-colors">Local Bookstores</a></li>
                                    </>
                                )}
                            </ul>
                        </div>

                        {/* Column 3 */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Socials</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-black transition-colors">Instagram</a></li>
                                <li><a href="#" className="hover:text-black transition-colors">Twitter (X)</a></li>
                                <li><a href="#" className="hover:text-black transition-colors">LinkedIn</a></li>
                                <li><a href="#" className="hover:text-black transition-colors">Medium</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div>
                        <Link
                            href={buttonUrl || "#"}
                            className="inline-block px-8 py-3 bg-[#EAB308] hover:bg-[#D9A507] text-black font-bold rounded-full transition-all shadow-sm hover:shadow-md active:scale-95 text-sm"
                        >
                            {buttonText}
                        </Link>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
                    <p>© {new Date().getFullYear()} Zeynep Yön. All rights reserved.</p>
                    <p>Made with 💛 for stories.</p>
                </div>
            </div>
        </footer>
    );
}
