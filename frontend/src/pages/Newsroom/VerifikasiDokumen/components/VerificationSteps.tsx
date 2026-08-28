import { verificationSteps } from "../verificationData";
const VerificationSteps = () => (
  <section className="mvc-steps-section">
    <div className="mvc-container">
      <header className="mvc-section-heading" data-mvc-reveal><span>Bagaimana MVC Bekerja?</span><p>Proses verifikasi digital dalam 6 langkah sederhana.</p></header>
      <ol className="mvc-steps">
        {verificationSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li data-mvc-reveal style={{ "--mvc-delay": `${index * 60}ms` } as React.CSSProperties} key={step.title}>
              <span className="mvc-step-number"><span>{index + 1}</span><Icon size={19} aria-hidden="true" /></span>
              <h3>{step.title}</h3><p>{step.description}</p>
            </li>
          );
        })}
      </ol>
    </div>
  </section>
);
export default VerificationSteps;
