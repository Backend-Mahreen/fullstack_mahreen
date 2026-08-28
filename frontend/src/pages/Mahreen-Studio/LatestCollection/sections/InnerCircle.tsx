import { useState, useEffect, useRef, type FormEvent } from "react";
import { publicEngagementService } from "../../../../services/engagement/publicEngagementService";

const innerCircleStyles = `

  .inner-circle {
    width: 100%;
    background: #000000;
    padding: 120px clamp(16px, 4vw, 32px); /* Padding diperbesar */
    text-align: center;
    overflow: hidden;
  }

  .inner-circle *,
  .inner-circle *::before,
  .inner-circle *::after {
    box-sizing: border-box;
  }

  .inner-circle__inner {
    max-width: 680px; /* Lebar area diperbesar */
    margin: 0 auto;
    opacity: 0;
    transform: translateY(40px);
  }

  /* Animasi Muncul (Fade Up) */
  @keyframes fadeUpInner {
    from {
      opacity: 0;
      transform: translateY(40px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .inner-circle.is-visible .inner-circle__inner {
    animation: fadeUpInner 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .inner-circle__title {
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(32px, 5vw, 56px); /* Font Title Diperbesar */
    font-weight: 500;
    color: #ffffff;
    margin: 0 0 16px;
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  .inner-circle__subtitle {
    font-family: "Inter", Arial, sans-serif;
    font-size: clamp(14px, 2vw, 18px); /* Font Subtitle Diperbesar */
    color: rgba(255,255,255,0.6);
    margin: 0 0 48px;
    line-height: 1.6;
  }

  .inner-circle__form {
    display: flex;
    gap: 0;
    max-width: 540px; /* Form input diperlebar */
    margin: 0 auto;
  }

  .inner-circle__input {
    flex: 1;
    height: 56px; /* Tinggi form input ditambah */
    padding: 0 24px;
    background: #111111;
    border: 1px solid rgba(255,255,255,0.12);
    border-right: none;
    color: #ffffff;
    font-family: "Inter", Arial, sans-serif;
    font-size: 15px; /* Font Input diperbesar */
    outline: none;
    transition: border-color 0.2s ease;
  }

  .inner-circle__input::placeholder {
    color: rgba(255,255,255,0.3);
  }

  .inner-circle__input:focus {
    border-color: rgba(214, 163, 92, 0.5);
  }

  .inner-circle__button {
    height: 56px; /* Tinggi button disamakan dengan form input */
    padding: 0 32px;
    background: #d6a35c;
    color: #000000;
    border: none;
    font-family: "DM Mono", monospace;
    font-size: 14px; /* Font Button diperbesar */
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 0.2s ease;
    white-space: nowrap;
  }

  .inner-circle__button:hover {
    background: #c4923f;
  }

  .inner-circle__note {
    margin: 20px 0 0;
    font-family: "Inter", Arial, sans-serif;
    font-size: 14px;
    color: rgba(255,255,255,0.3);
  }

  /* Styling khusus untuk state sukses (Redirect Action) */
  .inner-circle__success-title {
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(28px, 4vw, 42px);
    color: #d6a35c;
    margin: 0 0 16px;
  }
  
  .inner-circle__success-subtitle {
    font-family: "Inter", Arial, sans-serif;
    font-size: 16px;
    color: rgba(255,255,255,0.7);
    margin: 0 0 32px;
  }

  .inner-circle__redirect-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 52px;
    padding: 0 32px;
    font-family: "DM Mono", monospace;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1.5px;
    color: #ffffff;
    text-transform: uppercase;
    text-decoration: none;
    border: 1px solid rgba(255,255,255,0.3);
    background: transparent;
    transition: all 0.2s ease;
  }

  .inner-circle__redirect-btn:hover {
    background: rgba(255,255,255,0.05);
    border-color: #ffffff;
  }

  @media (max-width: 480px) {
    .inner-circle__form {
      flex-direction: column;
      gap: 12px;
    }

    .inner-circle__input {
      border-right: 1px solid rgba(255,255,255,0.12);
    }

    .inner-circle__button {
      width: 100%;
    }
  }
`;

const InnerCircle = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  
  // State untuk Animation Observer
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 } // Animasi ter-trigger saat 20% area terlihat
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setMessage("");
    setIsSubmitting(true);
    try {
      await publicEngagementService.subscribeNewsletter({
        email: normalizedEmail,
        source: "studio-inner-circle",
      });
      setSubmitted(true);
      setEmail("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Subscription could not be processed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      className={`inner-circle ${isVisible ? "is-visible" : ""}`} 
      id="inner-circle"
      ref={sectionRef}
    >
      <style data-component="inner-circle">{innerCircleStyles}</style>

      <div className="inner-circle__inner">
        {submitted ? (
          // Status Sukses & User Flow Redirect
          <div style={{ animation: "fadeUpInner 0.6s ease forwards" }}>
            <h2 className="inner-circle__success-title">Welcome to the Club.</h2>
            <p className="inner-circle__success-subtitle">
              Terima kasih! Alamat email Anda telah masuk ke dalam daftar prioritas kami.
            </p>
            <a href="/mahreen-studio" className="inner-circle__redirect-btn">
              Kembali ke Studio
            </a>
          </div>
        ) : (
          // Status Default (Subscribe Form)
          <>
            <h2 className="inner-circle__title">The Inner Circle</h2>
            <p className="inner-circle__subtitle">
              Receive early access to collections and exclusive showroom invites.
            </p>

            <form className="inner-circle__form" onSubmit={handleSubmit} noValidate>
              <input
                type="email"
                className="inner-circle__input"
                placeholder="Your Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setMessage("");
                }}
              />
              <button
                type="submit"
                className="inner-circle__button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Subscribe"}
              </button>
            </form>
            <p className="inner-circle__note">
              {message || "No spam. Unsubscribe anytime."}
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default InnerCircle;
