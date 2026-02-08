import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getSiteData } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
    const data = await getSiteData();
    const newsArticles = data.newsArticles || [];

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header */}
            <section className="bg-stone-50 py-24 mb-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-900">Latest News</h1>
                </div>
            </section>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {newsArticles.map((article: any) => (
                    <article key={article.id} className="flex flex-col group cursor-pointer hover:shadow-sm hover:translate-y-[-2px] transition-all duration-300 rounded-2xl p-4 -mx-4">
                        {/* Image */}
                        <Link href={`/news/${article.slug}`} className="block overflow-hidden rounded-2xl mb-6 shadow-sm">
                            <div className="relative w-full aspect-[4/3] bg-stone-100">
                                <Image
                                    src={article.imageUrl}
                                    alt={article.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                        </Link>

                        {/* Content */}
                        <div className="flex-1 flex flex-col space-y-3">
                            <Link href={`/news/${article.slug}`} className="block">
                                <h2 className="text-xl font-serif font-medium text-gray-900 leading-snug group-hover:text-amber-600 transition-colors">
                                    {article.title}
                                </h2>
                            </Link>

                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                                {article.excerpt}
                            </p>

                            <div className="pt-2 mt-auto">
                                <Link
                                    href={`/news/${article.slug}`}
                                    className="inline-flex items-center text-xs font-semibold text-amber-500 uppercase tracking-wider hover:text-amber-600 transition-colors"
                                >
                                    Read More <ArrowRight className="w-3.5 h-3.5 ml-1" />
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
