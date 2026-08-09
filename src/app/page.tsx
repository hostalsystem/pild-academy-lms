import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCourses } from "@/components/home/featured-courses";
import { StatsSection } from "@/components/home/stats-section";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { FloatingSupport } from "@/components/home/floating-support";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 pb-16">
      <HeroSection />
      <FeaturedCourses />
      <StatsSection />
      <WhyChooseUs />

      <FloatingSupport />
    </div>
  );
}