import { useCallback, useEffect, useMemo, useState } from "react";
import { faqService, type FaqRecord } from "../../../services/faq/faqService";

const FAQDownload = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<FaqRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFaqs = useCallback(async () => {
    try {
      const items = await faqService.list();
      setFaqs(items);
    } catch {
      setError("FAQ belum dapat dimuat. Silakan coba kembali nanti.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch async
    void loadFaqs();
  }, [loadFaqs]);

  const grouped = useMemo(() => {
    const map = new Map<string, FaqRecord[]>();
    for (const faq of faqs) {
      const category = faq.category || "Umum";
      const list = map.get(category) ?? [];
      list.push(faq);
      map.set(category, list);
    }
    return [...map.entries()];
  }, [faqs]);

  return (
    <div className="hc-section-wrapper">
      <section className="hc-faq-container">
        <h2 className="hc-section-title" style={{ textAlign: "center", marginBottom: "32px" }}>
          Pertanyaan Umum
        </h2>
        <div>
          {isLoading ? (
            <div className="hc-empty-state" role="status"><p>Memuat FAQ...</p></div>
          ) : error ? (
            <div className="hc-empty-state" role="alert"><p>{error}</p></div>
          ) : grouped.length === 0 ? (
            <div className="hc-empty-state" role="status"><p>Belum ada FAQ tersedia.</p></div>
          ) : (
            grouped.map(([category, items]) => (
              <div key={category} style={{ marginBottom: "28px" }}>
                <h3 style={{ color: "#d8b66f", fontSize: 14, marginBottom: 12 }}>{category}</h3>
                {items.map((faq, index) => {
                  const isOpen = openIndex === index;
                  const answerId = `help-faq-answer-${faq.id}-${index}`;
                  return (
                    <div key={faq.id} style={{ marginBottom: "12px" }}>
                      <button
                        type="button"
                        className="hc-faq-item"
                        style={{ width: "100%", color: "inherit", textAlign: "left" }}
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                      >
                        <h4>{faq.question}</h4>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-muted"
                          style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 180ms ease" }}
                          aria-hidden="true"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div
                          id={answerId}
                          style={{
                            marginTop: "-4px",
                            padding: "18px 24px",
                            border: "1px solid rgba(255,255,255,.05)",
                            borderTop: 0,
                            borderRadius: "0 0 8px 8px",
                            background: "#0b0b0b",
                            color: "rgba(255,255,255,.68)",
                            fontSize: "14px",
                            lineHeight: 1.7,
                          }}
                        >
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </section>

      <section aria-labelledby="help-download-center-title">
        <h2 className="hc-section-title" id="help-download-center-title">Download Center</h2>
        <div className="hc-empty-state" role="status">
          <p>Belum ada dokumen yang tersedia untuk diunduh.</p>
          <span>Dokumen resmi akan ditampilkan di sini setelah diterbitkan.</span>
        </div>
      </section>
    </div>
  );
};

export default FAQDownload;
