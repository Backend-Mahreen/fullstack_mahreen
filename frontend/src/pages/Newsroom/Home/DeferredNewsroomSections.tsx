import CTA from "./components/CTA";
import ClosingSection from "./components/ClosingSection";
import Footer from "./components/Footer";
import EventCalendar from "./sections/EventCalendar";
import NewsletterSection from "./sections/NewsletterSection";
import WebinarSection from "./sections/WebinarSection";
import type { NewsroomCategory } from "./sections/FeaturedSection";

type DeferredNewsroomSectionsProps = {
  activeCategory: NewsroomCategory;
  searchQuery: string;
};

const DeferredNewsroomSections = ({
  activeCategory,
  searchQuery,
}: DeferredNewsroomSectionsProps) => (
  <>
    <WebinarSection
      activeCategory={activeCategory}
      searchQuery={searchQuery}
    />
    <EventCalendar />
    <NewsletterSection />
    <div data-newsroom-reveal>
      <CTA />
    </div>
    <div data-newsroom-reveal>
      <ClosingSection />
    </div>
    <div data-newsroom-reveal>
      <Footer />
    </div>
  </>
);

export default DeferredNewsroomSections;
