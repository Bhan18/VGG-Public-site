"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Tag, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { useOffers, useNews } from "@/hooks/use-vgg-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function OffersNews() {
  const { data: offers, loading: oLoading } = useOffers();
  const { data: news, loading: nLoading } = useNews();

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Offers */}
        {(oLoading || (offers && offers.length > 0)) && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="max-w-3xl mb-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-xs font-semibold uppercase tracking-widest mb-4">
                <Tag className="h-3.5 w-3.5" /> Latest Offers
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Special <span className="text-gradient-gold">Limited-Time Deals</span>
              </h2>
            </motion.div>

            {oLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-3xl" />)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {(offers ?? []).map((o, i) => (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group relative rounded-3xl overflow-hidden glass-card gradient-border hover:shadow-2xl hover:shadow-accent/10 transition-all"
                  >
                    {o.image && (
                      <div className="relative h-44 overflow-hidden">
                        <Image
                          src={o.image}
                          alt={o.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <Badge className="absolute top-3 left-3 bg-amber-500 text-amber-950 border-0">
                          <Sparkles className="h-3 w-3 mr-1" /> Offer
                        </Badge>
                        {o.validUntil && (
                          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-white text-xs">
                            <Calendar className="h-3 w-3" />
                            Valid till {new Date(o.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2">{o.title}</h3>
                      {o.description && <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{o.description}</p>}
                      <button
                        onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
                      >
                        Claim this offer <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* News */}
        {(nLoading || (news && news.length > 0)) && (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="max-w-3xl mb-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
                <Calendar className="h-3.5 w-3.5" /> News & Announcements
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                Latest <span className="text-gradient-green">Updates</span>
              </h2>
            </motion.div>

            {nLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-3xl" />)}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {(news ?? []).slice(0, 3).map((n, i) => (
                  <motion.article
                    key={n.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group rounded-3xl overflow-hidden glass-card gradient-border hover:shadow-xl hover:shadow-primary/5 transition-all"
                  >
                    {n.image && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={n.image}
                          alt={n.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(n.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                      <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">{n.title}</h3>
                      {n.content && <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{n.content}</p>}
                      {n.link && (
                        <a
                          href={n.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
                        >
                          Read more <ArrowRight className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
