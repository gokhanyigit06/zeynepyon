import Link from "next/link";
// import Image from "next/image"; // Removed in favor of FallbackImage
import FallbackImage from "@/components/FallbackImage"; // Import new component
import AudioList from "@/components/AudioList";
import Hero from "@/components/Hero";
import { getSiteData } from "@/lib/db";

export const dynamic = 'force-dynamic'; // Ensure fresh data on every request

export default async function Home() {
  const data = await getSiteData() || {};
  const hero = data.hero || {};
  const book = data.book || {};
  const testimonials = data.testimonials || [];

  return (
    <div className="pb-20">
      {/* Hero / About Section */}
      <Hero data={hero} />

      {/* Latest Book Section */}
      <section className="py-20 bg-stone-50 -mx-6 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl font-serif text-gray-900">Latest Book</h2>
            <h3 className="text-5xl md:text-6xl font-serif text-black tracking-tight">
              {book.title}
            </h3>
            <p className="text-gray-500 italic text-lg">Written by {book.author}</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 mb-16">
            {/* Book Cover */}
            <div className="relative group perspective-1000">
              <div className="relative w-[300px] h-[450px] shadow-[20px_20px_40px_rgba(0,0,0,0.3)] transform rotate-y-[-10deg] md:group-hover:rotate-y-0 transition-transform duration-500 ease-out">
                <FallbackImage
                  src={book.coverUrl}
                  alt={book.title}
                  fill
                  className="object-cover rounded-r-xl rounded-l-sm"
                  fallbackSrc="https://placehold.co/300x450?text=Book+Cover"
                />
              </div>
            </div>

            {/* Testimonials */}
            <div className="flex-1 max-w-md space-y-12">
              {testimonials.map((t: any, index: number) => (
                <div key={t.id}>
                  {index > 0 && <div className="w-full h-px bg-gray-200 my-12" />}
                  <div className="text-center space-y-4">
                    <div className="flex justify-center gap-1 text-[#EAB308]">
                      {[...Array(t.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <blockquote className="text-lg text-gray-800 font-medium">
                      "{t.text}"
                    </blockquote>
                    <cite className="block not-italic">
                      <span className="block font-bold text-gray-900">{t.author}</span>
                      <span className="block text-sm text-gray-500 mt-1">{t.role}</span>
                    </cite>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap justify-center gap-4">
                {(book.stores?.length > 0 ? book.stores : [
                  { name: 'Amazon' }, { name: 'Apple Books' }, { name: 'Barnes & Noble' }, { name: 'Bookshop' }
                ]).map((store: any) => (
                  <Link
                    key={store.name}
                    href={store.url || "#"}
                    className="px-6 py-2 bg-white border border-gray-100 rounded-full shadow-sm text-sm font-semibold text-gray-600 flex items-center gap-2 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <span className="w-4 h-4 rounded-full bg-stone-200" />
                    {store.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audio Stories Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center mb-12 space-y-3">
          <h2 className="text-3xl font-serif text-gray-900">Audio Stories</h2>
          <p className="text-gray-500 text-lg">Listen to Zeynep's latest readings and thoughts.</p>
        </div>
        <AudioList tracks={data.audioStories || []} />
      </section>
    </div>
  );
}
