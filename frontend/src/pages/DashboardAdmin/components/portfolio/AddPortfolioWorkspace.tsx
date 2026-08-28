import { useRef, useState } from "react";
import {
  Bold,
  Eye,
  ImagePlus,
  Info,
  Italic,
  Link,
  Link2,
  Plus,
  Send,
  Trash2,
  UsersRound,
  X,
} from "lucide-react";
import MediaUrlInput from "../../../../components/admin/MediaUrlInput";
import {
  adminOperationsRepository,
  type NewPortfolioRecord,
} from "../../../../services/admin/adminOperationsRepository";

type AddPortfolioWorkspaceProps = Readonly<{
  onBack: () => void;
  onLocalAction: (message: string) => void;
}>;

const AddPortfolioWorkspace = ({ onBack, onLocalAction }: AddPortfolioWorkspaceProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [projectName, setProjectName] = useState("");
  const [category, setCategory] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectDate, setProjectDate] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [visibility, setVisibility] = useState<NewPortfolioRecord["visibility"]>("Public");
  const [userImpact, setUserImpact] = useState("");
  const [efficiencyGain, setEfficiencyGain] = useState("");
  const [revenueGrowth, setRevenueGrowth] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [heroUrlMode, setHeroUrlMode] = useState(false);
  const [error, setError] = useState("");

  const readImage = (file?: File) => {
    if (!file) return;
    if (file.size > 900_000) {
      setError("Gunakan gambar maksimal 900 KB agar penyimpanan lokal tetap ringan.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setHeroImage(typeof reader.result === "string" ? reader.result : "");
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const addTechnology = () => {
    const nextTechnology = techInput.trim();
    if (!nextTechnology || technologies.includes(nextTechnology)) return;
    setTechnologies((current) => [...current, nextTechnology]);
    setTechInput("");
  };

  const savePortfolio = (status: NewPortfolioRecord["status"]) => {
    if (!projectName.trim()) {
      setError("Nama proyek wajib diisi.");
      return;
    }
    try {
      const portfolio = adminOperationsRepository.savePortfolio({
        projectName: projectName.trim(),
        category,
        clientName,
        projectDate,
        description: description.trim(),
        technologies,
        visibility,
        userImpact,
        efficiencyGain,
        revenueGrowth,
        heroImage: heroImage || undefined,
        status,
      });
      setError("");
      onLocalAction(`${portfolio.projectName} tersimpan sebagai ${status.toLowerCase()} di penyimpanan lokal.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Portfolio gagal disimpan.");
    }
  };

  return (
    <section className="admin-portfolio-workspace admin-feature-enter" aria-labelledby="portfolio-workspace-title">
      <div className="admin-portfolio-breadcrumb"><button type="button" onClick={onBack}>Mahreen Operations Center</button><span>›</span><span>Portfolio Management</span><span>›</span><strong>Tambah Portfolio</strong></div>
      <header className="admin-product-form__heading admin-portfolio-heading"><div><h1 id="portfolio-workspace-title">Tambah Portfolio Baru</h1><p>Showcasing technological milestones and strategic innovations that define Mahreen’s commitment to exclusive craftsmanship and technical precision.</p></div><div><button className="admin-feature-outline-button" type="button" onClick={() => onLocalAction("Pratinjau portfolio dibuat dari data formulir saat ini.")}><Eye size={15} /> Pratinjau</button><button className="admin-feature-gold-button" type="button" onClick={() => savePortfolio("Published")}><Send size={15} /> Publikasikan Portfolio</button></div></header>

      {error ? <div className="admin-product-form__error" role="alert">{error}</div> : null}

      <div className="admin-portfolio-layout">
        <div className="admin-portfolio-main">
          <section className="admin-form-card admin-portfolio-card"><h2><Info size={17} /> Informasi Proyek</h2><div className="admin-form-grid"><label><span>Nama Proyek</span><input value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder="e.g. Quantum Ledger Infrastructure" /></label><label><span>Kategori Proyek</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>Infrastructure</option><option>Digital Product</option><option>Brand Experience</option><option>Corporate CSR</option></select></label><label><span>Nama Klien</span><input value={clientName} onChange={(event) => setClientName(event.target.value)} /></label><label><span>Tanggal Proyek</span><input type="date" value={projectDate} onChange={(event) => setProjectDate(event.target.value)} /></label></div></section>

          <section className="admin-form-card admin-portfolio-card"><h2><Send size={17} /> Deskripsi & Narasi Proyek</h2><div className="admin-editor-toolbar"><Bold size={14} /><Italic size={14} /><Link2 size={14} /></div><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Ceritakan bagaimana proyek ini memberikan dampak transformatif..." rows={8} /></section>

          <section className="admin-form-card admin-portfolio-card"><h2><Plus size={17} /> Teknologi yang Digunakan</h2><div className="admin-portfolio-tech-list">{technologies.map((technology) => <span key={technology}>{technology}<button type="button" aria-label={`Hapus ${technology}`} onClick={() => setTechnologies((current) => current.filter((item) => item !== technology))}><X size={11} /></button></span>)}</div><div className="admin-portfolio-tech-input"><input value={techInput} onChange={(event) => setTechInput(event.target.value)} placeholder="Tambahkan teknologi" onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTechnology(); } }} /><button type="button" onClick={addTechnology}><Plus size={13} /> Add Tech Stack</button></div></section>

          <section className="admin-form-card admin-portfolio-card"><h2><ImagePlus size={17} /> Media & Showcase</h2><span className="admin-form-label">Hero Showcase Image</span>
            {heroUrlMode ? (
              <MediaUrlInput
                onApply={(fileUrl) => { setHeroImage(fileUrl); setHeroUrlMode(false); setError(""); }}
                onCancel={() => setHeroUrlMode(false)}
              />
            ) : (
              <>
                <button className="admin-image-dropzone admin-portfolio-dropzone" type="button" onClick={() => imageInputRef.current?.click()}>{heroImage ? <img src={heroImage} alt="Preview portfolio" /> : <><span><ImagePlus size={20} /></span><strong>Click to upload or drag and drop</strong><small>High-resolution PNG, JPG (Min. 1920×1080px)</small></>}</button><input ref={imageInputRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(event) => readImage(event.target.files?.[0])} />
              </>
            )}
            {!heroImage && !heroUrlMode ? (
              <button type="button" className="admin-url-toggle" onClick={() => setHeroUrlMode(true)} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", border: "1px solid rgba(240, 200, 70, 0.25)", borderRadius: 4, background: "transparent", color: "#b7a45f", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", cursor: "pointer", marginTop: 6 }}>
                <Link size={12} /> Gunakan URL gambar
              </button>
            ) : null}
            <span className="admin-form-label">Gallery Grid</span><div className="admin-portfolio-gallery">{Array.from({ length: 4 }, (_, index) => <button type="button" key={index} onClick={() => imageInputRef.current?.click()} aria-label={`Tambah gambar galeri ${index + 1}`}><ImagePlus size={18} /></button>)}</div></section>
        </div>

        <aside className="admin-portfolio-aside">
          <section className="admin-form-card admin-portfolio-card"><span className="admin-feature-eyebrow">Pengaturan Publikasi</span><label><span>Visibilitas</span><div className="admin-portfolio-visibility"><button type="button" className={visibility === "Public" ? "is-active" : ""} onClick={() => setVisibility("Public")}>Publik</button><button type="button" className={visibility === "Private" ? "is-active" : ""} onClick={() => setVisibility("Private")}>Privat</button></div></label><div className="admin-portfolio-draft-status"><span>Status</span><strong><i /> Drafting Mode</strong></div><button className="admin-portfolio-delete" type="button" onClick={() => savePortfolio("Draft")}><Trash2 size={14} /> Simpan Sebagai Draft</button></section>

          <section className="admin-form-card admin-portfolio-card"><span className="admin-feature-eyebrow">Client Relationship</span><label className="admin-portfolio-client-search"><UsersRound size={14} /><input placeholder="Search ecosystem clients..." /></label><div className="admin-portfolio-client"><span>G</span><div><strong>{clientName}</strong><small>Enterprise Partner</small></div></div></section>

          <section className="admin-form-card admin-portfolio-card"><span className="admin-feature-eyebrow">Impact Metrics</span><label><span>User Impact (Total)</span><input value={userImpact} onChange={(event) => setUserImpact(event.target.value)} placeholder="e.g. 5M+ Active Users" /></label><label><span>Efficiency Gain (%)</span><input value={efficiencyGain} onChange={(event) => setEfficiencyGain(event.target.value)} placeholder="e.g. 45% reduction" /></label><label><span>Revenue Growth</span><input value={revenueGrowth} onChange={(event) => setRevenueGrowth(event.target.value)} placeholder="e.g. $12M YoY Increase" /></label></section>
        </aside>
      </div>
    </section>
  );
};

export default AddPortfolioWorkspace;
