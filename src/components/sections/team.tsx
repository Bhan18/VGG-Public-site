"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Users, Phone, Mail, Linkedin } from "lucide-react";
import { useTeam } from "@/hooks/use-vgg-data";
import { Skeleton } from "@/components/ui/skeleton";

export function Team() {
  const { data: team, loading } = useTeam();
  if (!loading && (!team || team.length === 0)) return null;

  return (
    <section id="team" className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            <Users className="h-3.5 w-3.5" /> Our Team
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Meet The <span className="text-gradient-green">People Behind VGG</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Our founding team brings decades of combined experience in real estate, civil engineering, and property law.
            When you buy from VGG, you're working directly with the people who built the company.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-3xl" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(team ?? []).map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-3xl overflow-hidden glass-card gradient-border hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  {m.photo ? (
                    <Image
                      src={m.photo}
                      alt={m.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-5xl font-bold text-white">
                      {m.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60" />
                  {/* Social icons overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {m.phone && (
                      <a href={`tel:${m.phone}`} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30" aria-label={`Call ${m.name}`}>
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30" aria-label={`Email ${m.name}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30" aria-label={`${m.name} on LinkedIn`}>
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold">{m.name}</h3>
                  {m.role && <p className="text-xs text-primary font-medium mt-0.5">{m.role}</p>}
                  {m.bio && <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">{m.bio}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
