import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

const Reveal = ({ children, className = "", delay = 0 }: RevealProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      const frame = window.requestAnimationFrame(() => setIsVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setIsVisible(true);
        observer.disconnect();
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -48px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`tp-reveal ${isVisible ? "is-visible" : ""} ${className}`.trim()}
      style={{ "--tp-reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
};

export default Reveal;
