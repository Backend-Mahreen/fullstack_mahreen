import { FilePlus2, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

export type NewsroomArticleDraft = Readonly<{
  author: string;
  category: string;
  title: string;
}>;

type NewsroomArticleComposerProps = Readonly<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (draft: NewsroomArticleDraft) => void;
}>;

const NewsroomArticleComposer = ({ isOpen, onClose, onSubmit }: NewsroomArticleComposerProps) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("Admin Mahreen");
  const [category, setCategory] = useState("Corporate Excellence");

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), author: author.trim() || "Admin Mahreen", category });
    setTitle("");
  };

  return (
    <div className="admin-newsroom-composer-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="admin-newsroom-composer admin-animate" role="dialog" aria-modal="true" aria-labelledby="newsroom-composer-title">
        <header>
          <span><FilePlus2 size={19} /></span>
          <div><h2 id="newsroom-composer-title">Create New Article</h2><p>Simpan ide editorial sebagai draft lokal.</p></div>
          <button type="button" aria-label="Tutup form artikel" onClick={onClose}><X size={19} /></button>
        </header>
        <form onSubmit={handleSubmit}>
          <label><span>Article title</span><input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter a clear editorial title" required /></label>
          <div>
            <label><span>Author</span><input value={author} onChange={(event) => setAuthor(event.target.value)} required /></label>
            <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>Corporate Excellence</option><option>CSR Initiatives</option><option>Internship Updates</option><option>Digital Transformation</option></select></label>
          </div>
          <footer><button type="button" onClick={onClose}>Cancel</button><button type="submit">Save draft</button></footer>
        </form>
      </section>
    </div>
  );
};

export default NewsroomArticleComposer;
