import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SiteSettingsEffects } from "@/components/site/site-settings-effects";
import { cn } from "@/lib/utils";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vgginfradevelopers.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VGG Infra Developers — Premium Farmland Plots Near Amaravathi Industrial Corridor",
    template: "%s | VGG Infra Developers",
  },
  description:
    "Invest in Premium White Sandalwood farmland plots near Amaravathi Industrial corridor. Sandalwood farms, mango orchards, and premium farmhouse plots with clear titles, modern amenities, and easy payment plans.",
  keywords: [
    "farmland plots Amaravathi",
    "sandalwood farm investment",
    "vgginfradevelopers.com",
    "White Sandalwood",
    "farmhouse plots Vinukonda",
    "VGG Infra Developers",
    "real estate investment Amaravathi",
    "agricultural land for sale",
  ],
  authors: [{ name: "VGG Infra Developers" }],
  creator: "VGG Infra Developers",
  publisher: "VGG Infra Developers",
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "VGG Infra Developers — Premium Farmland Plots Near Amaravathi Industrial Corridor",
    description:
      "Invest in Premium White Sandalwood farmland plots with clear titles, modern amenities, and easy payment plans. Sandalwood farms and premium farmhouse plots.",
    url: siteUrl,
    siteName: "VGG Infra Developers",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: `${siteUrl}/company-logo.jpg?v=1`,
        width: 1200,
        height: 630,
        alt: "VGG Infra Developers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VGG Infra Developers — Premium Farmland Plots",
    description:
      "Farmland plots near Amaravathi Industrial Corridor and Vinukonda. Sandalwood farms, mango orchards, and premium farmhouse plots.",
    images: [`${siteUrl}/company-logo.jpg?v=1`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: [{ url: "/company-logo.jpg?v=1", type: "image/jpeg" }],
    shortcut: ["/company-logo.jpg?v=1"],
    apple: [{ url: "/company-logo.jpg?v=1" }],
  },
  category: "real estate",
};

export const viewport: Viewport = {
  themeColor: "#0e1a14",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "VGG Infra Developers",
  description: "Premium farmland plots near Amaravathi Industrial Corridor. Clear title.",
  url: siteUrl,
  logo: `${siteUrl}/company-logo.jpg?v=1`,
  telephone: "+91-9491737999",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Pt.No-27, KCP Colony", // Update with your actual office address
    addressLocality: "Vijayawada", // Update with your actual city/locality
    addressRegion: "Andhra Pradesh",
    postalCode: "520007", // Update with correct postal code if needed
    addressCountry: "IN",
  },
  areaServed: "Andhra Pradesh, Telangana",
  sameAs: [],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var q=new URLSearchParams(location.search).get("theme");if(q?q==="light":localStorage.getItem("vgg-theme")==="light")document.documentElement.classList.remove("dark")}catch(e){}',
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={cn(geistSans.variable, geistMono.variable, jakarta.variable, "antialiased bg-background text-foreground font-sans")}>
        <SiteSettingsEffects />
        {children}
        <Toaster />
      </body>
    </html>
  );
}