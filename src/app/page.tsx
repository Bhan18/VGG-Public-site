import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { DemoDataBanner } from "@/components/site/demo-banner";
import { AdminButton } from "@/components/admin/admin-button";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { PlotSearch } from "@/components/sections/plot-search";
import { InteractiveLayout } from "@/components/sections/interactive-layout";
import { Gallery } from "@/components/sections/gallery";
import { Amenities } from "@/components/sections/amenities";
import { Location } from "@/components/sections/location";
import { Videos } from "@/components/sections/videos";
import { Testimonials } from "@/components/sections/testimonials";
import { Team } from "@/components/sections/team";
import { OffersNews } from "@/components/sections/offers-news";
import { FAQ } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <DemoDataBanner />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <FeaturedProjects />
        <PlotSearch />
        <InteractiveLayout />
        <Gallery />
        <Amenities />
        <Videos />
        <Location />
        <Testimonials />
        <Team />
        <OffersNews />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <AdminButton />
    </div>
  );
}
