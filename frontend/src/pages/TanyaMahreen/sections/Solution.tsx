import { useEffect, useRef, useState } from "react";
import iconConsultation from "../../../assets/TanyaMahreen/Home/icon-consultation.png";
import { getHashHref, handleHashRouteClick } from "../../../utils/hashNavigation";
import { packageCatalog } from "../KonfigurasiPaket/packageCatalog";

const solutionStyles = `
  .solution-section {
    padding: 100px 5%;
    background-color: #050505;
    color: #ffffff;
    display: flex;
    justify-content: center;
    overflow: hidden;
  }

  .solution-container {
    max-width: 1200px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 60px;
  }

  .solution-header {
    text-align: center;
    max-width: 700px;
    margin: 0 auto;
  }

  .solution-title {
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(36px, 5vw, 48px);
    font-weight: 600;
    margin-bottom: 16px;
    color: #ffffff;
  }

  .solution-subtitle {
    font-family: "DM Sans", sans-serif;
    font-size: 15px;
    color: #a0a0a0;
    line-height: 1.6;
    max-width: 550px;
    margin: 0 auto;
  }

  .solution-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
  }

  .solution-card {
    background-color: #0c0c0c;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
  }

  .solution-card:hover {
    border-color: rgba(228, 189, 105, 0.3);
    box-shadow: 0 10px 40px -10px rgba(228, 189, 105, 0.15);
    transform: translateY(-4px);
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .card-icon {
    color: #ddb66b;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-badge {
    background-color: rgba(228, 189, 105, 0.08);
    color: #ddb66b;
    border: 1px solid rgba(228, 189, 105, 0.15);
    padding: 6px 12px;
    border-radius: 999px;
    font-family: "DM Sans", sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .card-title {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #ffffff;
  }

  .card-list {
    list-style: none;
    padding: 0;
    margin: 0 0 32px 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex-grow: 1;
  }

  .card-list li {
    font-family: "DM Sans", sans-serif;
    font-size: 14px;
    color: #cccccc;
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .card-list li span {
    color: #ddb66b;
    font-size: 16px;
    line-height: 1;
  }

  .card-button {
    width: 100%;
    padding: 12px;
    background-color: transparent;
    color: #ffffff;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 999px;
    font-family: "DM Sans", sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    text-decoration: none;
    display: inline-block;
  }

  .solution-card:hover .card-button {
    border-color: rgba(228, 189, 105, 0.4);
    color: #ddb66b;
  }

  .card-button:hover {
    background-color: rgba(228, 189, 105, 0.1) !important;
    border-color: #ddb66b !important;
    color: #ddb66b !important;
    box-shadow: 0 0 20px rgba(228, 189, 105, 0.3), inset 0 0 10px rgba(228, 189, 105, 0.1);
    text-shadow: 0 0 8px rgba(228, 189, 105, 0.4);
  }

  .consultation-banner {
    background-color: #0c0c0c;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 20px;
    padding: 32px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    transition: all 0.4s ease;
  }

  .consultation-banner:hover {
    border-color: rgba(228, 189, 105, 0.3);
    box-shadow: 0 10px 40px -10px rgba(228, 189, 105, 0.15);
  }

  .banner-left {
    display: flex;
    align-items: center;
    gap: 32px;
    flex: 1;
    min-width: 0;
  }

  .banner-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .banner-icon img {
    width: 100px;
    height: 100px;
    object-fit: contain;
  }

  .banner-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 1;
    min-width: 0;
  }

  .banner-title-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 16px;
    flex-wrap: wrap;
  }

  .banner-title {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 28px;
    font-weight: 600;
    margin: 0;
    color: #ffffff;
  }

  .banner-badge {
    background-color: rgba(228, 189, 105, 0.1);
    color: #ddb66b;
    border: 1px solid rgba(228, 189, 105, 0.2);
    padding: 6px 16px;
    border-radius: 999px;
    font-family: "DM Sans", sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .banner-subtitle {
    font-family: "DM Sans", sans-serif;
    font-size: 14px;
    color: #a0a0a0;
    margin: 0;
  }

  .banner-tags {
    display: flex;
    align-items: center;
    gap: 40px;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  .tag {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: "DM Sans", sans-serif;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
    color: #ddb66b;
  }

  .tag-dot {
    width: 5px;
    height: 5px;
    background-color: #ddb66b;
    border-radius: 50%;
  }

  .btn-book-now {
    background: #ffe3b0;
    color: #111;
    font-family: "DM Sans", sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 16px 36px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    text-decoration: none;
    flex-shrink: 0;
  }

  .btn-book-now:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(239, 208, 131, 0.3);
    background: #ffd691;
  }

  @media (max-width: 1024px) {
    .consultation-banner {
      flex-direction: column;
      align-items: stretch;
      padding: 40px;
    }
    
    .banner-title-wrapper {
      justify-content: flex-start;
    }
    
    .btn-book-now {
      align-self: flex-start;
      margin-left: 132px;
    }
  }

  @media (max-width: 600px) {
    .solution-section {
      padding: 80px 5%;
    }
    
    .consultation-banner {
      padding: 32px;
    }
    
    .banner-left {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }
    
    .banner-tags {
      gap: 16px;
    }
    
    .btn-book-now {
      margin-left: 0;
      width: 100%;
      text-align: center;
      margin-top: 20px;
    }
  }

  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .reveal.active {
    opacity: 1;
    transform: translateY(0);
  }

  .delay-100 { transition-delay: 100ms; }
  .delay-200 { transition-delay: 200ms; }
  .delay-300 { transition-delay: 300ms; }
  .delay-400 { transition-delay: 400ms; }
  .delay-500 { transition-delay: 500ms; }
  .delay-600 { transition-delay: 600ms; }
`;


const formatStartingPrice = (price: number, suffix = "") => {
  const value = price >= 1_000_000
    ? `${Number((price / 1_000_000).toFixed(2))}JT`
    : `${Math.round(price / 1_000)}K`;

  return `MULAI DARI RP${value}${suffix}`;
};

const solutionsData = [
  {
    id: 1,
    title: "Website Solutions",
    route: packageCatalog.website.route,
    badge: formatStartingPrice(packageCatalog.website.tiers[0].price),
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
    items: ["Company Profile", "Landing Page", "Business Website", "Web App & UI/UX"],
    delay: "delay-100"
  },
  {
    id: 2,
    title: "Branding & Creative",
    route: packageCatalog.branding.route,
    badge: formatStartingPrice(packageCatalog.branding.tiers[0].price),
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
      </svg>
    ),
    items: ["Logo & Brand Identity", "Brand Guidelines", "Presentation Design", "Premium Packaging"],
    delay: "delay-200"
  },
  {
    id: 3,
    title: "Social Media Management",
    route: packageCatalog["social-media"].route,
    badge: formatStartingPrice(packageCatalog["social-media"].tiers[0].price, "/BLN"),
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
    ),
    items: ["Content Planning", "Creative Copywriting", "High-end Design", "Community Management"],
    delay: "delay-300"
  },
  {
    id: 4,
    title: "Digital Marketing",
    route: packageCatalog["digital-marketing"].route,
    badge: formatStartingPrice(packageCatalog["digital-marketing"].tiers[0].price),
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"></path>
        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
      </svg>
    ),
    items: ["Advanced SEO Strategy", "Lead Generation", "Email Marketing", "Funnel Automation"],
    delay: "delay-400"
  },
  {
    id: 5,
    title: "Advertising Campaign",
    route: packageCatalog.advertising.route,
    badge: formatStartingPrice(packageCatalog.advertising.tiers[0].price),
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="6"></circle>
        <circle cx="12" cy="12" r="2"></circle>
      </svg>
    ),
    items: ["Meta & Google Ads", "TikTok Ad Campaigns", "LinkedIn Optimization", "ROAS Management"],
    delay: "delay-500"
  },
  {
    id: 6,
    title: "Content Production",
    route: packageCatalog["content-production"].route,
    badge: formatStartingPrice(packageCatalog["content-production"].tiers[0].price),
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.82 2H4.18C2.97 2 2 2.97 2 4.18v15.64C2 21.03 2.97 22 4.18 22h15.64c1.21 0 2.18-.97 2.18-2.18V4.18C22 2.97 21.03 2 19.82 2z"></path>
        <path d="M7 2v20"></path>
        <path d="M17 2v20"></path>
        <path d="M2 12h20"></path>
        <path d="M2 7h5"></path>
        <path d="M2 17h5"></path>
        <path d="M17 17h5"></path>
        <path d="M17 7h5"></path>
      </svg>
    ),
    items: ["Product Photoshoot", "Cinematic Video", "Viral Reels Content", "Professional Co-Pro"],
    delay: "delay-600"
  }
];

const Solution = () => {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="solutions" className="solution-section" ref={sectionRef}>
      <style>{solutionStyles}</style>
      
      <div className="solution-container">
        <div className={`solution-header reveal ${isVisible ? "active" : ""}`}>
          <h2 className="solution-title">Our Solutions</h2>
          <p className="solution-subtitle">
            Elevate your brand with our premium digital services tailored for exclusive<br />business growth.
          </p>
        </div>

        <div className="solution-grid">
          {solutionsData.map((solution) => (
            <div 
              key={solution.id} 
              className={`solution-card reveal ${solution.delay} ${isVisible ? "active" : ""}`}
            >
              <div className="card-top">
                <div className="card-icon">{solution.icon}</div>
                <div className="card-badge">{solution.badge}</div>
              </div>
              
              <h3 className="card-title">{solution.title}</h3>
              
              <ul className="card-list">
                {solution.items.map((item, index) => (
                  <li key={index}>
                    <span>→</span> {item}
                  </li>
                ))}
              </ul>
              
              <a
                href={getHashHref(solution.route)}
                className="card-button"
                onClick={(event) => handleHashRouteClick(event, solution.route)}
              >
                Pilih Paket
              </a>
            </div>
          ))}
        </div>

        <div className={`consultation-banner reveal delay-600 ${isVisible ? "active" : ""}`}>
          <div className="banner-left">
            <div className="banner-icon">
              <img width="401" height="482" decoding="async" loading="lazy" src={iconConsultation} alt="Consultation Icon" />
            </div>
            
            <div className="banner-content">
              <div className="banner-title-wrapper">
                <h3 className="banner-title">Business Consultation</h3>
                <div className="banner-badge">{formatStartingPrice(packageCatalog.consultation.tiers[0].price, " / SESI")}</div>
              </div>
              
              <p className="banner-subtitle">
                Expert guidance for digital transformation, branding strategy, and personal branding excellence.
              </p>
              
              <div className="banner-tags">
                <div className="tag"><div className="tag-dot"></div> BUSINESS</div>
                <div className="tag"><div className="tag-dot"></div> BRAND</div>
                <div className="tag"><div className="tag-dot"></div> MARKETING</div>
                <div className="tag"><div className="tag-dot"></div> PERSONAL</div>
              </div>
            </div>
          </div>
          
          <a
            href={getHashHref(packageCatalog.consultation.route)}
            onClick={(event) =>
              handleHashRouteClick(event, packageCatalog.consultation.route)
            }
            className="btn-book-now"
          >
            Pilih Paket
          </a>
        </div>
      </div>
    </section>
  );
};

export default Solution;