import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQItem = {
  question: string;
  answer: string;
};

const faqItems: FAQItem[] = [
  {
    question: "Berapa lama waktu pengerjaan satu proyek?",
    answer:
      "Durasi pengerjaan menyesuaikan dengan ruang lingkup, tingkat kompleksitas, dan kebutuhan proyek. Estimasi waktu akan disampaikan secara transparan setelah proses konsultasi dan analisis kebutuhan dilakukan.",
  },
  {
    question: "Apakah bisa sistem pembayaran bertahap?",
    answer:
      "Ya. Sistem pembayaran dapat dilakukan secara bertahap sesuai dengan kesepakatan, tahapan pengerjaan, dan jenis layanan yang dipilih.",
  },
  {
    question: "Berapa kali jatah revisi yang diberikan?",
    answer:
      "Jumlah revisi menyesuaikan dengan paket atau layanan yang dipilih. Seluruh ketentuan revisi akan dijelaskan secara terstruktur sebelum proyek dimulai.",
  },
];

const faqStyles = `
  .tm-faq-section,
  .tm-faq-section *,
  .tm-faq-section *::before,
  .tm-faq-section *::after {
    box-sizing: border-box;
  }

  .tm-faq-section {
    position: relative;
    isolation: isolate;
    width: 100%;
    overflow: hidden;
    padding: 72px 24px 84px;
    background:
      radial-gradient(
        circle at 50% 20%,
        rgba(217, 176, 87, 0.025) 0%,
        transparent 38%
      ),
      #0b0b0b;
    color: #ffffff;
  }

  .tm-faq-section::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    z-index: -1;
    width: 520px;
    height: 280px;
    border-radius: 50%;
    background: rgba(220, 180, 91, 0.025);
    filter: blur(110px);
    transform: translateX(-50%);
    pointer-events: none;
  }

  .tm-faq-container {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
  }

  /* =========================
     HEADER
     ========================= */

  .tm-faq-header {
    text-align: center;
  }

  .tm-faq-eyebrow {
    margin: 0;
    color: #d8b15e;
    font-family: "DM Sans", Arial, sans-serif;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 2.5px;
    text-transform: uppercase;
  }

  .tm-faq-title {
    margin: 22px 0 0;
    color: rgba(255, 255, 255, 0.92);
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(22px, 2vw, 29px);
    font-weight: 400;
    line-height: 1.25;
  }

  /* =========================
     FAQ LIST
     ========================= */

  .tm-faq-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 82px;
  }

  .tm-faq-item {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.105);
    border-radius: 15px;
    background:
      linear-gradient(
        145deg,
        rgba(255, 255, 255, 0.02),
        rgba(255, 255, 255, 0.007)
      ),
      #111111;
    transition:
      border-color 350ms ease,
      background 350ms ease,
      box-shadow 350ms ease,
      transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .tm-faq-item::before {
    content: "";
    position: absolute;
    top: -60px;
    right: 80px;
    z-index: -1;
    width: 160px;
    height: 120px;
    border-radius: 50%;
    background: rgba(218, 177, 88, 0.1);
    filter: blur(55px);
    opacity: 0;
    transition: opacity 350ms ease;
    pointer-events: none;
  }

  .tm-faq-item:hover {
    transform: translateY(-2px);
    border-color: rgba(218, 177, 88, 0.18);
    box-shadow:
      0 14px 35px rgba(0, 0, 0, 0.2),
      0 0 22px rgba(218, 177, 88, 0.035);
  }

  .tm-faq-item:hover::before,
  .tm-faq-item.is-open::before {
    opacity: 1;
  }

  .tm-faq-item.is-open {
    border-color: rgba(218, 177, 88, 0.24);
    background:
      linear-gradient(
        145deg,
        rgba(218, 177, 88, 0.035),
        rgba(255, 255, 255, 0.008)
      ),
      #111111;
    box-shadow:
      0 16px 40px rgba(0, 0, 0, 0.22),
      0 0 24px rgba(218, 177, 88, 0.04);
  }

  /* =========================
     QUESTION BUTTON
     ========================= */

  .tm-faq-question {
    display: flex;
    width: 100%;
    min-height: 74px;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 22px 30px;
    border: 0;
    background: transparent;
    color: #ffffff;
    text-align: left;
    cursor: pointer;
  }

  .tm-faq-question-text {
    margin: 0;
    color: rgba(255, 255, 255, 0.93);
    font-family: "DM Sans", Arial, sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.45;
    transition:
      color 300ms ease,
      text-shadow 300ms ease;
  }

  .tm-faq-item:hover .tm-faq-question-text,
  .tm-faq-item.is-open .tm-faq-question-text {
    color: #ffffff;
    text-shadow: 0 0 18px rgba(255, 255, 255, 0.04);
  }

  /* =========================
     ICON
     ========================= */

  .tm-faq-icon-wrapper {
    position: relative;
    display: flex;
    width: 28px;
    height: 28px;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
  }

  .tm-faq-icon-wrapper::before {
    content: "";
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(218, 177, 88, 0.15);
    filter: blur(14px);
    opacity: 0;
    transition: opacity 300ms ease;
  }

  .tm-faq-item:hover .tm-faq-icon-wrapper::before,
  .tm-faq-item.is-open .tm-faq-icon-wrapper::before {
    opacity: 1;
  }

  .tm-faq-icon {
    position: relative;
    z-index: 2;
    width: 21px;
    height: 21px;
    color: #e0bb68;
    stroke-width: 2.5;
    transition:
      transform 420ms cubic-bezier(0.16, 1, 0.3, 1),
      color 300ms ease,
      filter 300ms ease;
  }

  .tm-faq-item.is-open .tm-faq-icon {
    transform: rotate(180deg);
    color: #f0cb78;
    filter: drop-shadow(0 0 8px rgba(224, 187, 104, 0.25));
  }

  /* =========================
     ANSWER
     ========================= */

  .tm-faq-answer-wrapper {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    transition:
      grid-template-rows 420ms cubic-bezier(0.16, 1, 0.3, 1),
      opacity 320ms ease;
  }

  .tm-faq-answer-wrapper.is-open {
    grid-template-rows: 1fr;
    opacity: 1;
  }

  .tm-faq-answer-inner {
    min-height: 0;
    overflow: hidden;
  }

  .tm-faq-answer {
    margin: 0;
    padding: 0 70px 25px 30px;
    color: rgba(255, 255, 255, 0.56);
    font-family: "DM Sans", Arial, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.75;
  }

  /* =========================
     REVEAL ANIMATION
     ========================= */

  .tm-faq-reveal {
    opacity: 0;
    filter: blur(7px);
    transform: translateY(28px);
    transition:
      opacity 800ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 800ms cubic-bezier(0.16, 1, 0.3, 1),
      filter 800ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .tm-faq-reveal.is-visible {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }

  .tm-faq-item-reveal {
    opacity: 0;
    filter: blur(6px);
    transform: translateY(28px) scale(0.985);
    transition:
      opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
      transform 700ms cubic-bezier(0.16, 1, 0.3, 1),
      filter 700ms cubic-bezier(0.16, 1, 0.3, 1),
      border-color 350ms ease,
      background 350ms ease,
      box-shadow 350ms ease;
  }

  .tm-faq-item-reveal.is-visible {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0) scale(1);
  }

  .tm-faq-item-reveal.is-visible:hover {
    transform: translateY(-2px) scale(1);
  }

  /* =========================
     TABLET
     ========================= */

  @media (max-width: 900px) {
    .tm-faq-section {
      padding: 72px 28px 76px;
    }

    .tm-faq-list {
      margin-top: 64px;
    }
  }

  /* =========================
     MOBILE
     ========================= */

  @media (max-width: 640px) {
    .tm-faq-section {
      padding: 64px 20px 68px;
    }

    .tm-faq-eyebrow {
      font-size: 14px;
      letter-spacing: 2.4px;
    }

    .tm-faq-title {
      margin-top: 18px;
      font-size: 23px;
    }

    .tm-faq-list {
      gap: 14px;
      margin-top: 48px;
    }

    .tm-faq-question {
      min-height: 70px;
      gap: 16px;
      padding: 20px 20px;
    }

    .tm-faq-question-text {
      font-size: 15px;
      line-height: 1.5;
    }

    .tm-faq-icon {
      width: 19px;
      height: 19px;
    }

    .tm-faq-answer {
      padding: 0 52px 22px 20px;
      font-size: 14px;
      line-height: 1.7;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .tm-faq-reveal,
    .tm-faq-item-reveal {
      opacity: 1;
      filter: none;
      transform: none;
      transition: none;
    }

    .tm-faq-item,
    .tm-faq-icon,
    .tm-faq-answer-wrapper {
      transition: none;
    }
  }
`;

const FAQ = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const currentSection = sectionRef.current;

    if (!currentSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(currentSection);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    observer.observe(currentSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleToggle = (index: number) => {
    setOpenIndex((currentIndex) =>
      currentIndex === index ? null : index
    );
  };

  return (
    <section
      ref={sectionRef}
      className="tm-faq-section"
      aria-labelledby="tm-faq-title"
    >
      <style data-component="tm-faq">{faqStyles}</style>

      <div className="tm-faq-container">
        {/* HEADER */}
        <div className="tm-faq-header">
          <p
            className={`tm-faq-eyebrow tm-faq-reveal ${
              isVisible ? "is-visible" : ""
            }`}
            style={{
              transitionDelay: isVisible ? "50ms" : "0ms",
            }}
          >
            FAQ
          </p>

          <h2
            id="tm-faq-title"
            className={`tm-faq-title tm-faq-reveal ${
              isVisible ? "is-visible" : ""
            }`}
            style={{
              transitionDelay: isVisible ? "140ms" : "0ms",
            }}
          >
            Pertanyaan Sering Diajukan
          </h2>
        </div>

        {/* FAQ LIST */}
        <div className="tm-faq-list">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            const answerId = `tm-faq-answer-${index}`;
            const questionId = `tm-faq-question-${index}`;

            return (
              <article
                key={item.question}
                className={[
                  "tm-faq-item",
                  "tm-faq-item-reveal",
                  isOpen ? "is-open" : "",
                  isVisible ? "is-visible" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                style={{
                  transitionDelay: isVisible
                    ? `${280 + index * 110}ms`
                    : "0ms",
                }}
              >
                <button
                  id={questionId}
                  type="button"
                  className="tm-faq-question"
                  onClick={() => handleToggle(index)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                >
                  <span className="tm-faq-question-text">
                    {item.question}
                  </span>

                  <span
                    className="tm-faq-icon-wrapper"
                    aria-hidden="true"
                  >
                    <ChevronDown className="tm-faq-icon" />
                  </span>
                </button>

                <div
                  id={answerId}
                  className={`tm-faq-answer-wrapper ${
                    isOpen ? "is-open" : ""
                  }`}
                  role="region"
                  aria-labelledby={questionId}
                >
                  <div className="tm-faq-answer-inner">
                    <p className="tm-faq-answer">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;