
import Navbar from "../../components/Navbar/Navbar";
import ClosingSection from "../../components/Cloasing-section/cloasing-section";
import Footer from "../../components/Footer/Footer";

import ProfileSection from "./sections/Profile";
import VisimisiSection from "./sections/Visimisi";
import LegalStatusSection from "./sections/Legal_status";

const tentangPageStyles = `

  .tentang-page {
    --tentang-black: #000000;
    --tentang-panel: #111111;
    --tentang-white: #ffffff;
    --tentang-muted: #a1a1aa;
    --tentang-gold: #c5a880;
    --tentang-border: rgba(255, 255, 255, 0.08);
    --tentang-gold-border: rgba(197, 168, 128, 0.3);

    width: 100%;
    min-height: 100vh;
    overflow-x: hidden;
    background: var(--tentang-black);
    color: var(--tentang-white);
    font-family: "DM Sans", Inter, Arial, sans-serif;
  }

  .tentang-page,
  .tentang-page *,
  .tentang-page *::before,
  .tentang-page *::after {
    box-sizing: border-box;
  }

  /*
    Menggunakan :where agar reset margin tidak menimpa
    margin khusus dari masing-masing section.
  */
  .tentang-page :where(p, h1, h2, h3, blockquote) {
    margin: 0;
  }
`;

const Tentang = () => {
  return (
    <>
      

      <style data-component="tentang-page">
        {tentangPageStyles}
      </style>

      <Navbar />

      <main className="tentang-page">
        <ProfileSection />
        <VisimisiSection />
        <LegalStatusSection />
      </main>

      <ClosingSection />
      <Footer />
    </>
  );
};

export default Tentang;