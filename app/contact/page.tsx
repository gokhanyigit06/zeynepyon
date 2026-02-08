import Link from "next/link";
import { Instagram, Linkedin, Youtube, Twitter } from "lucide-react";
import { getSiteData } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
    const data = await getSiteData();
    const { contact } = data;

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
            <div className="space-y-8 max-w-2xl mx-auto w-full">
                <h1 className="text-4xl md:text-5xl font-serif text-black mb-8">Contact</h1>

                <div className="space-y-2">
                    <p className="text-gray-500 font-light text-lg">Send me an email</p>
                    <a href={`mailto:${contact?.email}`} className="text-3xl md:text-4xl font-serif text-black hover:text-gray-600 transition-colors">
                        {contact?.email || "Email not set"}
                    </a>
                </div>

                <div className="pt-12">
                    <p className="text-gray-500 font-light text-lg mb-6">Or find me on social media</p>
                    <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
                        {contact?.socials?.instagram && (
                            <a href={contact.socials.instagram} target="_blank" rel="noopener noreferrer" className="group">
                                <Instagram className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
                            </a>
                        )}
                        {contact?.socials?.youtube && (
                            <a href={contact.socials.youtube} target="_blank" rel="noopener noreferrer" className="group">
                                <Youtube className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
                            </a>
                        )}
                        {contact?.socials?.linkedin && (
                            <a href={contact.socials.linkedin} target="_blank" rel="noopener noreferrer" className="group">
                                <Linkedin className="w-8 h-8 text-black group-hover:scale-110 transition-transform" />
                            </a>
                        )}
                        {contact?.socials?.medium && (
                            <a href={contact.socials.medium} target="_blank" rel="noopener noreferrer" className="group">
                                {/* Medium Icon (SVG) */}
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-8 h-8 text-black group-hover:scale-110 transition-transform"
                                >
                                    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                                </svg>
                            </a>
                        )}
                        {contact?.socials?.twitter && (
                            <a href={contact.socials.twitter} target="_blank" rel="noopener noreferrer" className="group">
                                {/* X / Twitter Icon (SVG) */}
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-8 h-8 text-black group-hover:scale-110 transition-transform"
                                >
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
