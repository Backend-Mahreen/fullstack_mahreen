import ContactForm from "./ContactForm";
import DirectContactCard from "./DirectContactCard";
import PartnershipReasons from "./PartnershipReasons";

const contactMainSectionStyles = `
  .contact-main-section {
    padding: 72px 24px 94px;
    background: #050505;
    color: #ffffff;
  }

  .contact-main-section,
  .contact-main-section * {
    box-sizing: border-box;
  }

  .contact-main-section__inner {
    display: grid;
    grid-template-columns: minmax(0, 0.78fr) minmax(540px, 1.22fr);
    gap: clamp(54px, 5vw, 86px);
    width: min(100%, 1480px);
    margin: 0 auto;
    align-items: start;
  }

  .contact-main-section__aside {
    min-width: 0;
  }

  @media (max-width: 1100px) {
    .contact-main-section__inner {
      grid-template-columns: minmax(0, 0.9fr) minmax(470px, 1.1fr);
      gap: 44px;
    }
  }

  @media (max-width: 920px) {
    .contact-main-section {
      padding-top: 60px;
    }

    .contact-main-section__inner {
      grid-template-columns: 1fr;
      gap: 48px;
    }
  }

  @media (max-width: 560px) {
    .contact-main-section {
      padding: 48px 16px 68px;
    }
  }
`;

const ContactMainSection = () => (
  <>
    <style data-component="contact-main-section">{contactMainSectionStyles}</style>
    <section className="contact-main-section" aria-label="Informasi dan formulir kontak Mahreen Indonesia">
      <div className="contact-main-section__inner">
        <div className="contact-main-section__aside">
          <PartnershipReasons />
          <DirectContactCard />
        </div>
        <ContactForm />
      </div>
    </section>
  </>
);

export default ContactMainSection;
