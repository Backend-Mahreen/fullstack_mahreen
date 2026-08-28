const VerificationTopbar = () => (
  <header className="verifikasi__topbar">
    <a className="verifikasi__topbar-brand" href="/newsroom" aria-label="Kembali ke Newsroom">
      MV<span>C</span>
    </a>

    <nav className="verifikasi__topbar-nav" aria-label="Status halaman verifikasi">
      <span
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.3)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Admin Preview System
      </span>
    </nav>

    <nav className="verifikasi__topbar-nav" aria-label="Navigasi Verification Center">
      <a href="/newsroom/verifikasi-dokumen" className="verifikasi__topbar-link is-active">
        Verification Center
      </a>
      <a href="/?section=ecosystem" className="verifikasi__topbar-link">
        Ecosystem
      </a>
      <a href="/portofolio" className="verifikasi__topbar-link">
        Portfolio
      </a>
      <a href="/login" className="verifikasi__topbar-login">
        Login
      </a>
    </nav>
  </header>
);

export default VerificationTopbar;
