import { useEffect, type ReactNode } from "react";
import loginVisual from "../../../assets/TanyaMahreen/Home/bground-tanyamahreen.webp";
import recoveryStyles from "./recoveryStyles";

type RecoveryShellProps = Readonly<{ variant: "forgot" | "reset"; children: ReactNode; visual: ReactNode }>;

const RecoveryShell = ({ variant, children, visual }: RecoveryShellProps) => {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("mahreen-recovery-document");
    body.classList.add("mahreen-recovery-body");
    return () => {
      html.classList.remove("mahreen-recovery-document");
      body.classList.remove("mahreen-recovery-body");
    };
  }, []);

  return (
    <>
      <style data-component="mahreen-recovery">{recoveryStyles}</style>
      <main className={`recovery-page recovery-page--${variant}`}>
        <section className="recovery-panel">{children}</section>
        <aside className="recovery-visual" style={{ "--recovery-image": `url(${loginVisual})` } as React.CSSProperties} aria-label="Keamanan akun Mahreen Indonesia">
          {variant === "reset" ? (
            <>
              <div className="recovery-visual__mosaic" aria-hidden="true" />
              <div className="recovery-visual__mosaic-grid" aria-hidden="true" />
              <div className="recovery-visual__brand">Mahreen Indonesia</div>
            </>
          ) : <div className="recovery-visual__image" aria-hidden="true" />}
          <div className="recovery-visual__overlay" aria-hidden="true" />
          <div className="recovery-visual__content">{visual}</div>
        </aside>
      </main>
    </>
  );
};
export default RecoveryShell;
