import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getSiteData } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getSiteData();
    const newsArticles = data.newsArticles || [];

    const article = newsArticles.find((a: any) => a.slug === slug);

    if (!article) {
        notFound();
    }

    // Find next and previous articles
    const currentIndex = newsArticles.findIndex((a: any) => a.slug === slug);
    const prevArticle = currentIndex > 0 ? newsArticles[currentIndex - 1] : null;
    const nextArticle = currentIndex < newsArticles.length - 1 ? newsArticles[currentIndex + 1] : null;

    return (
        <article className="min-h-screen bg-white pb-20 pt-10">
            {/* Main Content Wrapper */}
            <div className="max-w-4xl mx-auto px-6">

                {/* Title Section */}
                <div className="text-center py-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 leading-tight mb-4 tracking-tight">
                        {article.title}
                    </h1>
                </div>

                {/* Featured Image */}
                <div className="relative w-full aspect-[16/10] mb-16 rounded-[2rem] overflow-hidden shadow-sm">
                    <Image
                        src={article.imageUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Article Body */}
                <div
                    className="prose prose-lg prose-stone max-w-none text-gray-700 leading-relaxed font-sans"
                    dangerouslySetInnerHTML={{ __html: article.content || "" }}
                />

                {/* Navigation Footer */}
                <div className="mt-20 pt-10 border-t border-stone-200 flex justify-between items-center text-sm font-medium text-stone-500">
                    {prevArticle ? (
                        <Link href={`/news/${prevArticle.slug}`} className="flex items-center hover:text-black transition-colors group">
                            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                            Previous Article
                        </Link>
                    ) : (
                        <span className="opacity-50 cursor-not-allowed flex items-center">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Previous Article
                        </span>
                    )}

                    {nextArticle ? (
                        <Link href={`/news/${nextArticle.slug}`} className="flex items-center hover:text-black transition-colors group">
                            Next Article
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Link>
                    ) : (
                        <span className="opacity-50 cursor-not-allowed flex items-center">
                            Next Article <ArrowRight className="w-4 h-4 ml-2" />
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}
