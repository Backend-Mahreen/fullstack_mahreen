import { useEffect, useState } from "react";

const styles = `
  .newsroom-content-navbar {
    position: sticky;
    top: 0;
    z-index: 1200;
    display: flex;
    width: 100%;
    min-height: 56px;
    padding: 0 clamp(30px, 4.7vw, 76px);
    align-items: center;
    justify-content: space-between;
    color: #f4efe7;
    background: #000;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    transition:
      background-color 220ms ease,
      border-color 220ms ease,
      box-shadow 220ms ease;
  }

  .newsroom-content-navbar.is-scrolled {
    background: rgba(0, 0, 0, 0.94);
    border-bottom-color: rgba(229, 196, 119, 0.5);
    box-shadow:
      0 12px 30px rgba(0, 0, 0, 0.38),
      0 1px 0 rgba(229, 196, 119, 0.22),
      0 0 18px rgba(229, 196, 119, 0.1);
  }

  .newsroom-content-navbar__link {
    position: relative;
    display: inline-flex;
    min-height: 38px;
    padding: 0;
    align-items: center;
    color: #dad5cd;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 10px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 1.45px;
    text-decoration: none;
    text-transform: uppercase;
    transition:
      color 180ms ease,
      text-shadow 180ms ease;
  }

  .newsroom-content-navbar__link::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: "";
    background: #e5c477;
    box-shadow: 0 0 10px rgba(229, 196, 119, 0.55);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 180ms ease;
  }

  .newsroom-content-navbar__link:hover,
  .newsroom-content-navbar__link:focus-visible,
  .newsroom-content-navbar__link.is-active {
    color: #e5c477;
  }

  .newsroom-content-navbar__link:hover::after,
  .newsroom-content-navbar__link:focus-visible::after,
  .newsroom-content-navbar__link.is-active::after {
    transform: scaleX(1);
  }

  .newsroom-content-navbar__link.is-active {
    text-shadow:
      0 0 10px rgba(229, 196, 119, 0.28),
      0 0 22px rgba(229, 196, 119, 0.12);
  }

  @media (max-width: 640px) {
    .newsroom-content-navbar {
      min-height: 54px;
      padding-inline: 20px;
    }

    .newsroom-content-navbar__link {
      min-height: 36px;
      font-size: 9px;
      letter-spacing: 1.25px;
    }
  }
`;

type NewsroomContentNavbarProps = {
  activeMenu?: "newsroom" | "portofolio" | "contact";
};

const NewsroomContentNavbar = ({
  activeMenu = "newsroom",
}: NewsroomContentNavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{styles}</style>

      <header
        className={`newsroom-content-navbar${isScrolled ? " is-scrolled" : ""}`}
      >
        <a
          className={`newsroom-content-navbar__link${
            activeMenu === "newsroom" ? " is-active" : ""
          }`}
          href="/newsroom"
        >
          Newsroom
        </a>

        <a
          className={`newsroom-content-navbar__link${
            activeMenu === "portofolio" ? " is-active" : ""
          }`}
          href="/portofolio"
        >
          Portofolio
        </a>

      </header>
    </>
  );
};

export default NewsroomContentNavbar;
