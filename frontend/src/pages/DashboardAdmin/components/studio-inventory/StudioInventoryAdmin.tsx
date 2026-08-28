import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Eye,
  EyeOff,
  MoreVertical,
  PackagePlus,
  Pencil,
  SlidersHorizontal,
  Trash2,
  TrendingUp,
} from "lucide-react";
import latestProduct1 from "../../../../assets/Mahreen-Studio/LatestCollection/lastest_produk_1.png";
import latestProduct2 from "../../../../assets/Mahreen-Studio/LatestCollection/lastest_produk_2.png";
import latestProduct3 from "../../../../assets/Mahreen-Studio/LatestCollection/lastest_produk_3.webp";
import lifestyleEssentials from "../../../../assets/Mahreen-Studio/Collection/lifestyle-essentials.png";
import {
  adminEcosystemRepository,
  type StudioAdminSnapshot,
  type StudioProductRecord,
} from "../../../../services/admin/adminEcosystemRepository";
import AddStudioProduct from "./AddStudioProduct";

type StudioInventoryAdminProps = Readonly<{
  query: string;
  onLocalAction: (message: string) => void;
}>;

const productImages = [latestProduct1, latestProduct2, latestProduct3, lifestyleEssentials];

const formatPrice = (value: number) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
}).format(value);

const ProductThumbnail = ({ product, index }: { product: StudioProductRecord; index: number }) => (
  <span className="admin-product-thumb">
    <img src={product.image || productImages[index % productImages.length]} alt="" loading="lazy" decoding="async" />
  </span>
);

const StudioInventoryAdmin = ({ query, onLocalAction }: StudioInventoryAdminProps) => {
  const [snapshot, setSnapshot] = useState<StudioAdminSnapshot>(() =>
    adminEcosystemRepository.getStudioSnapshot(),
  );
  const [view, setView] = useState<"inventory" | "create">("inventory");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  useEffect(() => adminEcosystemRepository.subscribe(() => {
    setSnapshot(adminEcosystemRepository.getStudioSnapshot());
  }), []);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return snapshot.products.filter((product) => {
      const matchesQuery = !normalized || [product.name, product.subtitle, product.category, product.sku]
        .some((value) => value.toLowerCase().includes(normalized));
      return matchesQuery && (!lowStockOnly || product.status !== "In Stock");
    });
  }, [lowStockOnly, query, snapshot.products]);

  const removeProduct = (product: StudioProductRecord) => {
    if (!window.confirm(`Hapus ${product.name} dari inventori lokal?`)) return;
    adminEcosystemRepository.removeStudioProduct(product.id);
    onLocalAction(`${product.name} dihapus dari inventori lokal.`);
  };

  if (view === "create") {
    return (
      <AddStudioProduct
        onCancel={() => setView("inventory")}
        onSaved={(product) => {
          setView("inventory");
          onLocalAction(`${product.name} tersimpan ke inventori lokal.`);
        }}
      />
    );
  }

  const inStock = snapshot.products.reduce((total, product) => total + product.stock, 0);
  const lowStock = snapshot.products.filter((product) => product.status === "Low Stock").length;

  return (
    <section className="admin-feature-page admin-feature-enter" aria-labelledby="studio-inventory-title">
      <header className="admin-feature-heading admin-feature-heading--inventory">
        <div>
          <span className="admin-feature-eyebrow">MAHREEN · MASTER PRODUCT LIST</span>
          <h1 id="studio-inventory-title">Product Inventory</h1>
          <p>Manage and monitor your high-end collection. Ensure stock levels align with the studio’s luxury standards and exclusivity.</p>
        </div>
        <button className="admin-feature-gold-button admin-feature-gold-button--large" type="button" onClick={() => setView("create")}><PackagePlus size={17} /> Tambah Produk</button>
      </header>

      <div className="admin-feature-metrics admin-feature-metrics--studio">
        <article className="admin-inventory-stat"><span>Total SKU</span><strong>{snapshot.products.length.toLocaleString("en-US")}</strong><small>local products</small></article>
        <article className="admin-inventory-stat"><span>In Stock</span><strong>{inStock.toLocaleString("en-US")}</strong><small>items</small></article>
        <article className="admin-inventory-stat"><span>Low Stock</span><strong className="is-danger">{lowStock}</strong><small>critical</small></article>
        <article className="admin-inventory-stat"><span>Active Visibility</span><strong>{snapshot.activeVisibility}%</strong><small>public</small></article>
      </div>

      <article className="admin-feature-panel admin-inventory-panel">
        <header className="admin-inventory-toolbar">
          <div><button type="button" className={lowStockOnly ? "is-active" : ""} onClick={() => setLowStockOnly((current) => !current)}><SlidersHorizontal size={15} /> Filter</button><span>Showing {filteredProducts.length} of {snapshot.products.length.toLocaleString("en-US")} products</span></div>
          <div><button type="button" aria-label="Export product list" onClick={() => onLocalAction("Daftar inventori siap diekspor dari penyimpanan lokal.")}><Download size={16} /></button><button type="button" aria-label="More inventory options"><MoreVertical size={17} /></button></div>
        </header>
        <div className="admin-feature-table-scroll">
          <table className="admin-feature-table admin-inventory-table">
            <thead><tr><th>Name</th><th>Category</th><th>SKU</th><th>Price</th><th>Stock Status</th><th>Visibility</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product.id}>
                  <td><div className="admin-product-name"><ProductThumbnail product={product} index={index} /><div><strong>{product.name}</strong><small>{product.subtitle}</small></div></div></td>
                  <td>{product.category}</td>
                  <td><code>{product.sku}</code></td>
                  <td><strong>{formatPrice(product.price)}</strong></td>
                  <td><span className={`admin-stock-status admin-stock-status--${product.status.toLowerCase().replaceAll(" ", "-")}`}>{product.status}<small>{product.stock ? `(${product.stock})` : ""}</small></span></td>
                  <td><span className={`admin-product-visibility${product.visibility === "Hidden" ? " is-hidden" : ""}`}>{product.visibility === "Public" ? <Eye size={14} /> : <EyeOff size={14} />}{product.visibility}</span></td>
                  <td><div className="admin-product-actions"><button type="button" aria-label={`Edit ${product.name}`} onClick={() => onLocalAction(`${product.name} siap diedit melalui adapter lokal.`)}><Pencil size={15} /></button><button type="button" aria-label={`Hapus ${product.name}`} onClick={() => removeProduct(product)}><Trash2 size={15} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer className="admin-inventory-pagination"><span>Page 1 of 1</span><nav aria-label="Inventory pagination"><button type="button" className="is-active">1</button></nav></footer>
      </article>

      <div className="admin-feature-grid admin-feature-grid--inventory">
        <article className="admin-feature-panel admin-forecast-panel">
          <header className="admin-feature-panel__heading"><div><h2>Stock Distribution</h2><p>Current availability by local product SKU.</p></div><TrendingUp size={20} /></header>
          <div className="admin-forecast-chart" aria-label="Current stock distribution diagram">
            {snapshot.inventoryForecast.map((value, index) => <div key={snapshot.products[index]?.id ?? index}><span style={{ "--chart-value": `${value}%`, "--chart-delay": `${index * 70}ms` } as React.CSSProperties} /><small>{snapshot.products[index]?.sku.slice(-5) ?? "EMPTY"}</small></div>)}
          </div>
        </article>
        <article className="admin-feature-panel admin-warehouse-panel">
          <header className="admin-feature-panel__heading"><div><h2>Storage Status</h2><p>Current browser-local inventory capacity.</p></div></header>
          <div className="admin-warehouse-list">
            {snapshot.warehouses.map((warehouse, index) => <div key={warehouse.label}><span><strong>{warehouse.label}</strong><em>{warehouse.value}%</em></span><i><b style={{ "--bar-value": `${warehouse.value}%`, "--chart-delay": `${index * 100}ms` } as React.CSSProperties} /></i></div>)}
          </div>
          <button className="admin-feature-outline-button" type="button" onClick={() => onLocalAction("Detail logistik dibuka dari penyimpanan lokal.")}>View Detailed Logistics</button>
        </article>
      </div>
    </section>
  );
};

export default StudioInventoryAdmin;
