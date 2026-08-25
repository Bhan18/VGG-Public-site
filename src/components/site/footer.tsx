"use client";
import { Trees, Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin, ArrowUp, Send } from "lucide-react";
import { useSettings } from "@/hooks/use-vgg-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const { data: settings } = useSettings();
  const phone = settings?.phone ?? "+91 98765 43210";
  const email = settings?.email ?? "info@vgginfra.com";
  const address = settings?.address ?? "Bengaluru, Karnataka";
  const companyName = settings?.companyName ?? "VGG Infra Developers";

  const scrollTo = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "About Us", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Interactive Layout", href: "#layout" },
    { label: "Gallery", href: "#gallery" },
    { label: "Amenities", href: "#amenities" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="mt-auto bg-gradient-to-b from-background to-emerald-950/5 dark:to-emerald-950/20 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center">
                <Trees className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">{companyName}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Premium DTCP-approved farmland plots near Bengaluru. Investing in green wealth since 2010.
            </p>
            <div className="flex gap-2">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
                { icon: Linkedin, label: "LinkedIn" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => scrollTo(l.href)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-start gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{phone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{address}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-3">Get latest project updates and offers in your inbox.</p>
            <form onSubmit={(e) => { e.preventDefault(); (e.target as HTMLFormElement).reset(); }} className="flex gap-2">
              <Input type="email" placeholder="Your email" className="bg-secondary/40" required />
              <Button type="submit" size="icon" aria-label="Subscribe">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} {companyName}. All rights reserved. · DTCP Approved · RERA Compliant
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-full"
          >
            <ArrowUp className="h-3.5 w-3.5 mr-1" /> Back to Top
          </Button>
        </div>
      </div>
    </footer>
  );
}
