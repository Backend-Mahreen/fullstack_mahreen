import CSRNavbar from "../../../components/Navbar/CSRNavbar";
import Footer from "../../../components/Footer/Footer";
import ClosingSection from "../../../components/Cloasing-section/cloasing-section";
import Hero from "./sections/Hero";
import Overview from "./sections/Overview";
import Timeline from "./sections/Timeline";
import ImpactResult from "./sections/ImpactResult";
import Documentation from "./sections/Documentation";
import Testimonial from "./sections/Testimonial";
import FAQ from "./sections/FAQ";
import ProgramCTA from "./sections/ProgramCTA";
import CSRPageEffects from "../components/CSRPageEffects";
const ProgramObjective = () => {
  return (
    <>
      <CSRNavbar />
      <CSRPageEffects rootId="program-objective" />

      <main className="program-objective-content" id="program-objective">
        <Hero />
        <Overview />
        <Timeline />
        <ImpactResult />
        <Documentation />
        <Testimonial />
        <FAQ />
        <ProgramCTA />
      </main>

      <ClosingSection />
      <Footer />
    </>
  );
};

export default ProgramObjective;
