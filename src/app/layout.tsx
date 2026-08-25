import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vgginfra.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VGG Infra Developers — Premium Farmland Plots Near Bengaluru",
    template: "%s | VGG Infra Developers",
  },
  description:
    "Invest in DTCP-approved farmland plots near Bengaluru. Sandalwood farms, mango orchards, and premium farmhouse plots with clear titles, modern amenities, and easy payment plans.",
  keywords: [
    "farmland plots Bengaluru",
    "sandalwood farm investment",
    "DTCP approved plots",
    "mango orchard plots",
    "farmhouse plots Karnataka",
    "VGG Infra Developers",
    "real estate investment Bengaluru",
    "agricultural land for sale",
  ],
  authors: [{ name: "VGG Infra Developers" }],
  creator: "VGG Infra Developers",
  publisher: "VGG Infra Developers",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "VGG Infra Developers — Premium Farmland Plots Near Bengaluru",
    description:
      "Invest in DTCP-approved farmland plots with clear titles, modern amenities, and easy payment plans. Sandalwood farms, mango orchards, and premium farmhouse plots.",
    url: siteUrl,
    siteName: "VGG Infra Developers",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "VGG Infra Developers — Premium Farmland",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VGG Infra Developers — Premium Farmland Plots",
    description:
      "DTCP-approved farmland plots near Bengaluru. Sandalwood farms, mango orchards, and premium farmhouse plots.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  category: "real estate",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f5ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1a14" },
  ],
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "VGG Infra Developers",
  description: "Premium farmland plots near Bengaluru. DTCP approved with clear titles.",
  url: siteUrl,
  logo: `${siteUrl}/logo.svg`,
  telephone: "+91-98765-43210",
  address: {
    "@type": "PostalAddress",
    streetAddress: "No. 42, MG Road",
    addressLocality: "Bengaluru",
    addressRegion: "Karnataka",
    postalCode: "560001",
    addressCountry: "IN",
  },
  areaServed: "Bengaluru, Karnataka, Tamil Nadu",
  sameAs: [],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={cn(geistSans.variable, geistMono.variable, jakarta.variable, "antialiased bg-background text-foreground font-sans")}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
