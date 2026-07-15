"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Images, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useGallery } from "@/hooks/use-vgg-data";
import { Skeleton } from "@/components/ui/skeleton";

export function Gallery() {
  const { data: images, loading } = useGallery();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);

  const categories = useMemo(() => {
    const set = new Set<string>();
    (images ?? []).forEach((g) => { if (g.category) set.add(g.category); });
    return ["All", ...Array.from(set)];
  }, [images]);

  const filtered = useMemo(
    () => (images ?? []).filter((g) => activeCategory === "All" || g.category === activeCategory),
    [images, activeCategory]
  );
  const visible = filtered.slice(0, visibleCount);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const next = () => setLightboxIdx((i) => (i === null ? i : (i + 1) % filtered.length));
  const prev = () => setLightboxIdx((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length));

  return (
    <section id="gallery" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            <Images className="h-3.5 w-3.5" /> Gallery
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            A Glimpse Of <span className="text-gradient-green">Our Farmlands</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Browse through our gallery to see the landscapes, infrastructure, and lifestyle that await you at every VGG project.
            From grand entrance gateways to lush tree-lined avenues, every detail is crafted with care.
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setVisibleCount(9); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-secondary hover:bg-secondary/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        {loading ? (
          <div className="masonry-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="masonry-item h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="masonry-grid">
            {visible.map((img, i) => (
              <motion.button
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                onClick={() => openLightbox(i)}
                className="masonry-item group relative block w-full rounded-2xl overflow-hidden glass-card"
              >
                <div className="relative w-full">
                  <Image
                    src={img.image}
                    alt={img.title ?? "Gallery image"}
                    width={800}
                    height={Math.round(400 + (i % 3) * 150)}
                    sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-left translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                    {img.title && <p className="text-white font-semibold text-sm">{img.title}</p>}
                    {img.category && <p className="text-white/70 text-xs">{img.category}</p>}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Load more */}
        {visibleCount < filtered.length && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setVisibleCount((c) => c + 9)}
              className="px-6 py-3 rounded-full border border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Load More ({filtered.length - visibleCount} remaining)
            </button>
          </div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxIdx !== null && filtered[lightboxIdx] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-black/90 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <button
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20"
                onClick={closeLightbox}
                aria-label="Close lightbox"
              >
                <X className="h-6 w-6" />
              </button>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <motion.div
                key={filtered[lightboxIdx].id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative max-w-5xl max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={filtered[lightboxIdx].image}
                  alt={filtered[lightboxIdx].title ?? "Gallery image"}
                  width={1600}
                  height={1000}
                  className="max-w-full max-h-[80vh] rounded-xl object-contain"
                />
                {(filtered[lightboxIdx].title || filtered[lightboxIdx].category) && (
                  <div className="mt-4 text-center">
                    {filtered[lightboxIdx].title && <p className="text-white font-semibold">{filtered[lightboxIdx].title}</p>}
                    {filtered[lightboxIdx].category && <p className="text-white/60 text-sm">{filtered[lightboxIdx].category}</p>}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
