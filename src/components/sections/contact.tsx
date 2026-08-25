"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, MessageCircle, Clock, Building2, User } from "lucide-react";
import { useSettings } from "@/hooks/use-vgg-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function Contact() {
  const { data: settings, loading } = useSettings();
  const [submitting, setSubmitting] = useState(false);

  const phone = settings?.phone ?? "+91 98765 43210";
  const email = settings?.email ?? "info@vgginfra.com";
  const address = settings?.address ?? "Bengaluru, Karnataka";
  const companyName = settings?.companyName ?? "VGG Infra Developers";

  const phoneDigits = phone.replace(/[^\d+]/g, "");
  const waNumber = phoneDigits.replace("+", "").replace(/^91/, "") || "919876543210";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "");
    const phoneNum = String(formData.get("phone") ?? "");
    const message = String(formData.get("message") ?? "");
    // Compose WhatsApp message (since we don't have a backend mail service, we redirect to WhatsApp)
    const text = `*New Enquiry from VGG Website*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phoneNum)}%0A*Message:* ${encodeURIComponent(message)}`;
    setTimeout(() => {
      setSubmitting(false);
      window.open(`https://wa.me/${waNumber}?text=${text}`, "_blank");
      toast.success("Opening WhatsApp with your enquiry...");
      (e.target as HTMLFormElement).reset();
    }, 600);
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-3xl mx-auto text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-4">
            <MessageCircle className="h-3.5 w-3.5" /> Contact Us
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Let's Find Your <span className="text-gradient-green">Perfect Plot</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Ready to own a piece of nature? Drop us a message, give us a call, or schedule a free site visit.
            Our team responds within 24 hours and walks you through every step — from selection to registration.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Left: contact info + map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {loading ? (
              <Skeleton className="h-32 rounded-2xl" />
            ) : (
              <>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="block p-5 rounded-2xl glass-card gradient-border hover:shadow-lg hover:shadow-primary/5 transition-shadow group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Call Us</p>
                      <p className="text-lg font-bold">{phone}</p>
                    </div>
                  </div>
                </a>

                <a
                  href={`mailto:${email}`}
                  className="block p-5 rounded-2xl glass-card gradient-border hover:shadow-lg hover:shadow-primary/5 transition-shadow group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Email Us</p>
                      <p className="text-lg font-bold">{email}</p>
                    </div>
                  </div>
                </a>

                <div className="p-5 rounded-2xl glass-card gradient-border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Visit Us</p>
                      <p className="text-base font-semibold">{address}</p>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-xl hover:shadow-emerald-500/30 transition-shadow group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/70">WhatsApp</p>
                      <p className="text-lg font-bold">Chat with us instantly</p>
                    </div>
                  </div>
                </a>

                <div className="p-5 rounded-2xl glass-card flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Working Hours</p>
                    <p className="text-base font-semibold">Mon - Sat: 9:30 AM - 7:00 PM</p>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl gradient-border p-6 md:p-8"
          >
            <h3 className="text-xl font-bold mb-1">Send an Enquiry</h3>
            <p className="text-sm text-muted-foreground mb-6">Fill in your details and we'll reach out within 24 hours.</p>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="mb-1.5 block text-sm font-medium">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" name="name" required placeholder="Your name" className="pl-10" />
                </div>
              </div>
              <div>
                <Label htmlFor="phone" className="mb-1.5 block text-sm font-medium">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" name="phone" type="tel" required placeholder="+91 98765 43210" className="pl-10" />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" name="email" type="email" placeholder="you@email.com" className="pl-10" />
                </div>
              </div>
              <div>
                <Label htmlFor="message" className="mb-1.5 block text-sm font-medium">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell us about your requirements — project, plot size, budget, etc."
                  className="resize-none"
                />
              </div>
              <Button type="submit" size="lg" disabled={submitting} className="w-full">
                {submitting ? (
                  <>Sending...</>
                ) : (
                  <><Send className="h-4 w-4 mr-2" /> Send Enquiry</>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                By submitting, you agree to be contacted by {companyName} about your enquiry.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
