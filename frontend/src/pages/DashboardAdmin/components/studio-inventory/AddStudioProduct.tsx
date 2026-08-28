import { useRef, useState } from "react";
import {
  Bold,
  CalendarDays,
  ImagePlus,
  Info,
  Italic,
  Link2,
  Link,
  Package,
  RefreshCcw,
  Save,
  Tags,
  UploadCloud,
  X,
} from "lucide-react";
import MediaUrlInput from "../../../../components/admin/MediaUrlInput";
import {
  adminEcosystemRepository,
  type NewStudioProduct,
  type StudioProductRecord,
} from "../../../../services/admin/adminEcosystemRepository";

type AddStudioProductProps = Readonly<{
  onCancel: () => void;
  onSaved: (product: StudioProductRecord) => void;
}>;

const AddStudioProduct = ({ onCancel, onSaved }: AddStudioProductProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState<NewStudioProduct["collection"]>("Signature");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [visibility, setVisibility] = useState<NewStudioProduct["visibility"]>("Public");
  const [currentStatus, setCurrentStatus] = useState("Published");
  const [weight, setWeight] = useState("500g");
  const [dimensions, setDimensions] = useState("L × W × H");
  const [shippingClass, setShippingClass] = useState("Standard Luxury");
  const [image, setImage] = useState("");
  const [imageUrlMode, setImageUrlMode] = useState(false);
  const [error, setError] = useState("");

  const readImage = (file?: File) => {
    if (!file) return;
    if (file.size > 900_000) {
      setError("Gunakan gambar maksimal 900 KB agar penyimpanan lokal tetap ringan.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(typeof reader.result === "string" ? reader.result : "");
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Nama produk wajib diisi.");
      return;
    }
    try {
      const product = adminEcosystemRepository.saveStudioProduct({
        name: name.trim(),
        subtitle: collection === "Limited Edition" ? "Limited Collection" : `${collection} Collection`,
        category,
        sku: sku.trim(),
        price,
        discountPrice: discountPrice || undefined,
        stock,
        lowStockThreshold,
        visibility,
        collection,
        description: description.trim(),
        material: material.trim(),
        tags: ["Gold", "Handcrafted", "Premium"],
        weight,
        dimensions,
        shippingClass,
        image: image || undefined,
      });
      onSaved(product);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Produk gagal disimpan.");
    }
  };

  return (
    <form className="admin-product-form admin-feature-enter" onSubmit={handleSubmit}>
      <header className="admin-product-form__heading">
        <div><span className="admin-feature-eyebrow">MAHREEN STUDIO · PRODUCT WORKSPACE</span><h1>Tambah Produk Baru</h1><p>Daftarkan koleksi eksklusif baru ke dalam katalog Mahreen Studio.</p></div>
        <div><button className="admin-feature-outline-button" type="button" onClick={onCancel}>Batalkan</button><button className="admin-feature-gold-button" type="submit"><Save size={16} /> Simpan Produk</button></div>
      </header>

      {error ? <div className="admin-product-form__error" role="alert">{error}</div> : null}

      <div className="admin-product-form__layout">
        <div className="admin-product-form__main">
          <section className="admin-form-card">
            <h2><Info size={18} /> Informasi Dasar</h2>
            <label><span>Product Name</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Contoh: Midnight Silk Kaftan" /></label>
            <div className="admin-form-grid"><label><span>SKU</span><input value={sku} onChange={(event) => setSku(event.target.value)} /></label><label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>Luxury Apparel</option><option>Home Decor</option><option>Lighting</option><option>Furnishings</option></select></label></div>
            <fieldset><legend>Collection</legend><div className="admin-form-segment">{(["Essentials", "Signature", "Limited Edition"] as const).map((item) => <button className={collection === item ? "is-active" : ""} type="button" key={item} onClick={() => setCollection(item)}>{item}</button>)}</div></fieldset>
          </section>

          <section className="admin-form-card">
            <h2><Package size={18} /> Detail Produk</h2>
            <label><span>Deskripsi Eksklusif</span><div className="admin-editor-toolbar"><Bold size={14} /><Italic size={14} /><Link2 size={14} /></div><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Tuliskan narasi kemewahan produk ini..." rows={6} /></label>
            <label><span>Spesifikasi Material</span><textarea value={material} onChange={(event) => setMaterial(event.target.value)} placeholder="Contoh: 100% Mulberry Silk, Gold-plated accents..." rows={3} /></label>
          </section>

          <section className="admin-form-card">
            <h2><Package size={18} /> Manajemen Stok & Harga</h2>
            <div className="admin-form-grid"><label><span>Price (IDR)</span><div className="admin-input-prefix"><b>Rp</b><input type="number" min="0" value={price} onChange={(event) => setPrice(Number(event.target.value))} /></div></label><label><span>Discount Price</span><div className="admin-input-prefix"><b>Rp</b><input type="number" min="0" value={discountPrice || ""} placeholder="Optional" onChange={(event) => setDiscountPrice(Number(event.target.value))} /></div></label><label><span>Initial Stock Level</span><input type="number" min="0" value={stock} onChange={(event) => setStock(Number(event.target.value))} /></label><label><span>Low Stock Threshold</span><input type="number" min="0" value={lowStockThreshold} onChange={(event) => setLowStockThreshold(Number(event.target.value))} /></label></div>
          </section>

          <section className="admin-form-card">
            <h2><ImagePlus size={18} /> Media & Galeri</h2>
            <span className="admin-form-label">Primary Product Image</span>
            {imageUrlMode ? (
              <MediaUrlInput
                onApply={(fileUrl) => {
                  setImage(fileUrl);
                  setImageUrlMode(false);
                  setError("");
                }}
                onCancel={() => setImageUrlMode(false)}
              />
            ) : (
              <>
                <button className="admin-image-dropzone" type="button" onClick={() => inputRef.current?.click()}>{image ? <img src={image} alt="Preview produk" /> : <><UploadCloud size={34} /><strong>Seret foto utama ke sini</strong><small>High Resolution TIFF or PNG recommended (Min 2000px)</small></>}</button>
                <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(event) => readImage(event.target.files?.[0])} />
              </>
            )}
            {!image && !imageUrlMode ? (
              <button type="button" className="admin-url-toggle" onClick={() => setImageUrlMode(true)}>
                <Link size={13} /> Gunakan URL gambar
              </button>
            ) : null}
            <span className="admin-form-label">Gallery Grid (Lifestyle Shots)</span>
            <div className="admin-gallery-grid"><button type="button" onClick={() => inputRef.current?.click()}><ImagePlus size={19} /><span>Add</span></button><i /><i /><i /></div>
          </section>
        </div>

        <aside className="admin-product-form__aside">
          <section className="admin-form-card">
            <h2><RefreshCcw size={18} /> Panel Status</h2>
            <label><span>Visibility</span><button className="admin-visibility-switch" type="button" onClick={() => setVisibility((value) => value === "Public" ? "Hidden" : "Public")}><b>{visibility}</b><i className={visibility === "Public" ? "is-active" : ""} /></button></label>
            <label><span>Current Status</span><select value={currentStatus} onChange={(event) => setCurrentStatus(event.target.value)}><option>Published</option><option>Draft</option><option>Scheduled</option></select></label>
            <label><span>Schedule Publication</span><button className="admin-schedule-button" type="button"><CalendarDays size={15} /> Atur Jadwal<br /><small>(Optional)</small></button></label>
            <button className="admin-feature-gold-button admin-publish-button" type="submit">Publish Now</button>
          </section>

          <section className="admin-form-card">
            <h2><Tags size={18} /> Atribut Produk</h2>
            <span className="admin-form-label">Tags</span><div className="admin-tag-list">{["Gold", "Handcrafted", "Premium"].map((tag) => <span key={tag}>{tag}<X size={10} /></span>)}</div>
            <input placeholder="Tambah tag..." />
            <div className="admin-form-grid"><label><span>Weight</span><input value={weight} onChange={(event) => setWeight(event.target.value)} /></label><label><span>Dimensions</span><input value={dimensions} onChange={(event) => setDimensions(event.target.value)} /></label></div>
            <label><span>Shipping Class</span><select value={shippingClass} onChange={(event) => setShippingClass(event.target.value)}><option>Standard Luxury</option><option>Oversized Luxury</option><option>Fragile Collection</option></select></label>
          </section>
        </aside>
      </div>
    </form>
  );
};

export default AddStudioProduct;
