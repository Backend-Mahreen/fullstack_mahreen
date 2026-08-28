const currentYear = new Date().getFullYear();

const VerificationFooter = () => (
  <footer className="verifikasi__bottom-bar">
    <span className="verifikasi__bottom-brand">MVC</span>
    <span className="verifikasi__bottom-copy">
      © {currentYear} Mahreen Verification Center. All rights reserved.
    </span>
    <div className="verifikasi__bottom-links">
      <a href="/?section=ecosystem" className="verifikasi__bottom-link">Ecosystem</a>
      <a href="/help-center" className="verifikasi__bottom-link">Security</a>
      <a href="/kebijakan-privasi" className="verifikasi__bottom-link">Privacy Policy</a>
      <a href="/contact" className="verifikasi__bottom-link">Contact Us</a>
    </div>
  </footer>
);

export default VerificationFooter;
