import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { verificationFaqs } from "../verificationData";

const VerificationFaqCta = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section className="mvc-faq-section">
      <div className="mvc-container mvc-faq-grid">
        <div className="mvc-faq" data-mvc-reveal>
          <h2>Pertanyaan Umum (FAQ)</h2>
          <div className="mvc-faq__items">
            {verificationFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <article className={`mvc-faq-item${isOpen ? " is-open" : ""}`} key={faq.question}>
                  <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} aria-expanded={isOpen}><span>{faq.question}</span><ChevronDown size={18} aria-hidden="true" /></button>
                  <div className="mvc-faq-item__answer" aria-hidden={!isOpen}><p>{faq.answer}</p></div>
                </article>
              );
            })}
          </div>
        </div>
        <aside className="mvc-contact-card" data-mvc-reveal style={{ "--mvc-delay": "120ms" } as React.CSSProperties}>
          <h2>Bangun Kepercayaan Melalui Verifikasi Digital</h2>
          <p>Jadilah bagian dari ekosistem bisnis yang transparan dan akuntabel bersama Mahreen Indonesia.</p>
          <a href="/contact">Hubungi Tim IT<ArrowRight size={18} aria-hidden="true" /></a>
        </aside>
      </div>
    </section>
  );
};
export default VerificationFaqCta;
