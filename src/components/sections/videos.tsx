"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Video, X } from "lucide-react";
import { useVideos } from "@/hooks/use-vgg-data";
import { Skeleton } from "@/components/ui/skeleton";

export function Videos() {
  const { data: videos, loading } = useVideos();
  const [active, setActive] = useState<string | null>(null);

  if (!loading && (!videos || videos.length === 0)) return null;

  return (
    <section id="videos" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold uppercase tracking-widest mb-4">
            <Video className="h-3.5 w-3.5" /> Video Tours
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Watch Our <span className="text-gradient-gold">Project Walkthroughs</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Take a virtual tour of our projects from the comfort of your home. See the layouts, infrastructure, and natural
            beauty that make VGG farmlands special.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-3xl" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(videos ?? []).map((v, i) => (
              <motion.button
                key={v.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setActive(v.url)}
                className="group relative h-56 rounded-3xl overflow-hidden glass-card gradient-border text-left"
              >
                {v.thumbnail && (
                  <Image src={v.thumbnail} alt={v.title} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 transition-all">
                    <Play className="h-7 w-7 text-white fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold text-sm line-clamp-2">{v.title}</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <button className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20" aria-label="Close video">
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative w-full max-w-4xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe src={active} className="w-full h-full rounded-xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
