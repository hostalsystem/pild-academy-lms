import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCourses } from "@/components/home/featured-courses";
import { StatsSection } from "@/components/home/stats-section";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { FloatingSupport } from "@/components/home/floating-support";

export default function HomePage() {
  return (
    <main>
      <HeroSection />

      <FeaturedCourses />

      <StatsSection />

      <WhyChooseUs />

      <FloatingSupport />
    </main>
  );
}