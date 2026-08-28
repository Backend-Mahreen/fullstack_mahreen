import { useEffect, useRef, useState } from "react";

const workflowStyles = `
  .workflow-section {
    padding: 100px 5%;
    background-color: #050505;
    color: #ffffff;
    display: flex;
    justify-content: center;
    overflow: hidden;
  }

  .workflow-content {
    width: 100%;
    max-width: 1100px;
  }

  .workflow-title {
    font-family: "Playfair Display", Georgia, serif;
    font-size: clamp(32px, 5vw, 42px);
    font-weight: 600;
    text-align: center;
    margin-bottom: 80px;
    color: #ffffff;
  }

  .timeline-wrapper {
    width: 100%;
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .timeline-wrapper::-webkit-scrollbar {
    display: none;
  }

  .timeline-container {
    position: relative;
    min-width: 800px;
    padding: 24px 0;
  }

  .timeline-line {
    position: absolute;
    top: 94px;
    left: 4%;
    right: 4%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.15);
    z-index: 1;
    transform-origin: left;
    transform: scaleX(0);
    transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .timeline-line.active {
    transform: scaleX(1);
  }

  .timeline-steps {
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 2;
  }

  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    cursor: pointer;
  }

  .step-circle {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background-color: #1a1816;
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "DM Sans", sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 36px;
    transition: all 0.3s ease;
    position: relative;
    z-index: 3;
  }

  .step-label {
    font-family: "DM Sans", sans-serif;
    font-size: 14px;
    color: #cccccc;
    text-align: center;
    white-space: nowrap;
    transition: all 0.3s ease;
  }

  .step-item:hover .step-circle {
    background-color: #ddb66b;
    border-color: #ddb66b;
    color: #050505;
    transform: translateY(-4px);
    box-shadow: 0 0 16px rgba(228, 189, 105, 0.5), 0 0 32px rgba(228, 189, 105, 0.3);
  }

  .step-item:hover .step-label {
    color: #ffffff;
    transform: translateY(-2px);
  }

  .reveal-up {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .reveal-up.active {
    opacity: 1;
    transform: translateY(0);
  }

  .delay-100 { transition-delay: 100ms; }
  .delay-200 { transition-delay: 200ms; }
  .delay-300 { transition-delay: 300ms; }
  .delay-400 { transition-delay: 400ms; }
  .delay-500 { transition-delay: 500ms; }
  .delay-600 { transition-delay: 600ms; }
  .delay-700 { transition-delay: 700ms; }
  .delay-800 { transition-delay: 800ms; }
`;

const stepsData = [
  { id: "01", label: "Konsultasi", delay: "delay-100" },
  { id: "02", label: "Analisis", delay: "delay-200" },
  { id: "03", label: "Proposal", delay: "delay-300" },
  { id: "04", label: "Persetujuan", delay: "delay-400" },
  { id: "05", label: "DP 50%", delay: "delay-500" },
  { id: "06", label: "Pengerjaan", delay: "delay-600" },
  { id: "07", label: "Review", delay: "delay-700" },
  { id: "08", label: "Pelunasan", delay: "delay-800" },
];

const Workflow = () => {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="workflow-section" ref={sectionRef}>
      <style>{workflowStyles}</style>
      
      <div className="workflow-content">
        <h2 className={`workflow-title reveal-up ${isVisible ? "active" : ""}`}>
          Workflow & Strategy
        </h2>

        <div className="timeline-wrapper">
          <div className="timeline-container">
            <div className={`timeline-line ${isVisible ? "active" : ""}`}></div>
            
            <div className="timeline-steps">
              {stepsData.map((step) => (
                <div 
                  key={step.id} 
                  className={`step-item reveal-up ${step.delay} ${isVisible ? "active" : ""}`}
                >
                  <div className="step-circle">{step.id}</div>
                  <div className="step-label">{step.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;