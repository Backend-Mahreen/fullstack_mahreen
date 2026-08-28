import CSRNavbar from "../../components/Navbar/CSRNavbar";
import Footer from "../../components/Footer/Footer";
import HeroSection from "./sections/HeroSection";
import AboutSection from "./sections/AboutSection";
import DaftarSekarangSection from "./sections/DaftarSekarangSection";
import ProgramPillarsSection from "./sections/ProgramPillarsSection";
import FeaturedProgramsSection from "./sections/FeaturedProgramsSection";
import CSRPageEffects from "./components/CSRPageEffects";

const csrStyles = `
  .csr-content {
    width: 100vw;
    max-width: 100vw;
    min-width: 0;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background: #000000;
    color: #ffffff;
  }
`;

const CSR = () => {
  return (
    <>
      
      <style data-component="csr">{csrStyles}</style>
      <CSRNavbar />
      <CSRPageEffects rootId="csr" />

      <main className="csr-content" id="csr">
        <HeroSection />
        <AboutSection />
        <ProgramPillarsSection />
        <FeaturedProgramsSection />
        <DaftarSekarangSection />
      </main>

      <Footer />
    </>
  );
};

export default CSR;
