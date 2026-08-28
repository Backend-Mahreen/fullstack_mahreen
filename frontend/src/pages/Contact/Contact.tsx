import Navbar from "../../components/Navbar/Navbar";
import ClosingSection from "../../components/Cloasing-section/cloasing-section";
import Footer from "../../components/Footer/Footer";
import ContactHero from "./components/ContactHero";
import ContactMainSection from "./components/ContactMainSection";

const contactPageStyles = `

  .contact-page {
    width: 100%;
    min-width: 0;
    overflow-x: hidden;
    background: #050505;
  }
`;

const Contact = () => {
  return (
    <div className="contact-page">
      <style data-component="contact-page">{contactPageStyles}</style>
      <Navbar />
      <main>
        <ContactHero />
        <ContactMainSection />
        <ClosingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
