import React, { useEffect, useState } from 'react';

import StudioNavbar from "../../../components/Navbar/StudioNavbar";

// Import sub-section dari folder sebelah (Sections/)
import Creative_process from './sections/Creative_process';
import Experience from './sections/Experience';
import ClosingSection from '../../../components/Cloasing-section/cloasing-section';
import Footer from '../../../components/Footer/Footer';
import { useAuth } from "../../../hooks/useAuth";
import { getLoginRedirectRoute } from "../../../services/auth/authNavigation";
import { navigateToHashRoute } from "../../../utils/hashNavigation";
import { addStudioCartItem, selectStudioBuyNowItem } from "../Purchase/storage";
import { formatStudioPrice, getStudioProductBySlug } from "../data/studioCatalog";

const getCurrentProductSlug = () => {
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    const slug = pathParts.at(-1) ?? "signature-noir-hoodie";

    return decodeURIComponent(slug);
};

const detailProdukStyles = `
  .detail-produk-page {
    background-color: #0a0a0a;
    width: 100%;
    min-height: 100vh;
  }

  .detail-produk-container,
  .gallery-section,
  .info-section,
  .thumbnails,
  .main-image {
    will-change: transform, opacity;
  }

  .detail-produk-container {
    opacity: 0;
    transform: translateY(18px);
    transition: opacity 620ms cubic-bezier(0.16, 1, 0.3, 1), transform 620ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .detail-produk-page.is-ready .detail-produk-container {
    opacity: 1;
    transform: translateY(0);
  }

  .detail-produk-page:not(.is-ready) .gallery-section,
  .detail-produk-page:not(.is-ready) .info-section {
    opacity: 0;
    transform: translateY(14px);
  }

  .detail-produk-page.is-ready .gallery-section,
  .detail-produk-page.is-ready .info-section {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 560ms cubic-bezier(0.16, 1, 0.3, 1), transform 560ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .detail-produk-page.is-ready .gallery-section {
    transition-delay: 80ms;
  }

  .detail-produk-page.is-ready .info-section {
    transition-delay: 150ms;
  }

  @media (prefers-reduced-motion: reduce) {
    .detail-produk-container,
    .gallery-section,
    .info-section,
    .thumbnail-btn,
    .size-option,
    .color-option {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
      animation: none !important;
      will-change: auto;
    }
  }

  .detail-produk-container {
    max-width: 1240px;
    margin: 0 auto;
    padding: 120px 20px 40px 20px; /* Padding top dinaikkan (120px) supaya tidak tertutup navbar fixed */
    font-family: 'Inter', sans-serif;
    color: #ffffff;
  }
  .product-breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0 0 28px;
    color: rgba(255, 255, 255, 0.45);
    font-size: 14px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .product-breadcrumb a {
    color: rgba(255, 255, 255, 0.68);
    text-decoration: none;
    transition: color 180ms ease;
  }
  .product-breadcrumb a:hover,
  .product-breadcrumb a:focus-visible {
    color: #e4c47f;
  }
  .product-breadcrumb a:focus-visible {
    outline: 2px solid rgba(228, 196, 127, 0.8);
    outline-offset: 3px;
  }
  .product-breadcrumb__separator {
    color: rgba(255, 255, 255, 0.24);
  }
  .size-guide-panel {
    margin: -4px 0 24px;
    padding: 16px 18px;
    border: 1px solid rgba(228, 196, 127, 0.24);
    background: rgba(228, 196, 127, 0.05);
    color: rgba(255, 255, 255, 0.68);
    font-size: 14px;
    line-height: 1.7;
  }
  .purchase-feedback {
    margin: -46px 0 40px;
    padding: 12px 14px;
    border: 1px solid rgba(228, 196, 127, 0.3);
    color: #e4c47f;
    font-size: 14px;
    line-height: 1.5;
  }
  .product-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
  }
  @media (min-width: 768px) {
    .product-grid {
      grid-template-columns: 1.2fr 1fr;
    }
  }
  .gallery-section {
    display: flex;
    gap: 16px;
  }
  .thumbnails {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .thumbnail-btn {
    width: 70px;
    height: 90px;
    background-color: #1a1a1a;
    border: 1px solid #333;
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.2s;
  }
  .thumbnail-btn.active {
    border-color: #d6a35c;
  }
  .thumbnail-btn img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .main-image {
    flex-grow: 1;
    background-color: #1a1a1a;
    border: 1px solid #222;
    height: 550px;
    overflow: hidden;
  }
  .main-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
  .info-section {
    display: flex;
    flex-direction: column;
  }
  .collection-label {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #d6a35c;
    margin-bottom: 8px;
  }
  .product-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 600;
    margin: 0 0 12px 0;
    letter-spacing: 0.5px;
  }
  .product-price {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 32px;
  }
  .section-title {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #888;
    margin-bottom: 12px;
  }
  .color-picker {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
  }
  .color-option {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    padding: 2px;
    background-clip: content-box;
    transition: border-color 0.2s;
  }
  .color-option.active {
    border-color: #d6a35c;
  }
  .size-block {
    margin-bottom: 34px;
  }
  .size-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
    margin-bottom: 18px;
  }
  .size-label {
    margin: 0;
    color: rgba(255, 255, 255, 0.34);
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 5px;
    line-height: 1;
    text-transform: uppercase;
  }
  .size-guide {
    color: #e4c47f;
    background: transparent;
    border: 0;
    padding: 0;
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    cursor: pointer;
    text-transform: uppercase;
    transition: color 180ms ease, opacity 180ms ease;
  }
  .size-guide:hover {
    color: #f0d79a;
  }
  .size-picker {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 0;
  }
  .size-option {
    width: 100%;
    height: 54px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.09);
    color: rgba(255, 255, 255, 0.84);
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 1px;
    cursor: pointer;
    transition: border-color 180ms ease, color 180ms ease, background-color 180ms ease, transform 180ms ease;
  }
  .size-option:hover {
    border-color: rgba(228, 196, 127, 0.65);
    color: #ffffff;
  }
  .size-option.active {
    background-color: transparent;
    color: #e4c47f;
    border-color: #e4c47f;
  }
  .size-option:focus-visible,
  .size-guide:focus-visible {
    outline: 2px solid rgba(228, 196, 127, 0.85);
    outline-offset: 3px;
  }
  @media (max-width: 520px) {
    .size-picker {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .size-label {
      font-size: 14px;
      letter-spacing: 3px;
    }
  }
  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 64px;
  }
  .btn-primary, .btn-secondary {
    padding: 16px;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
  }
  .btn-primary, .btn-secondary {
    position: relative;
    overflow: hidden;
    transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms ease, border-color 220ms ease, background-color 220ms ease;
  }
  .btn-primary {
    background-color: #e4c47f;
    color: #0a0a0a;
    border: 1px solid #e4c47f;
    box-shadow: 0 12px 30px rgba(228, 196, 127, 0.12);
  }
  .btn-primary:hover, .btn-secondary:hover {
    transform: translateY(-2px);
  }
  .btn-primary:hover {
    background: #f1d89f;
    box-shadow: 0 18px 40px rgba(228, 196, 127, 0.23);
  }
  .btn-secondary {
    background-color: transparent;
    color: #ffffff;
    border: 1px solid #333;
  }
  .product-accordion {
    margin-top: 6px;
  }
  .accordion-item {
    border-top: 1px solid #222;
  }
  .accordion-item:last-child {
    border-bottom: 1px solid #222;
  }
  .accordion-header {
    width: 100%;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.88);
    padding: 22px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 3px;
  }
  .accordion-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.42);
    font-size: 24px;
    line-height: 1;
    transform: rotate(0deg);
    transition: transform 180ms ease, color 180ms ease;
  }
  .accordion-icon.is-open {
    transform: rotate(180deg);
    color: #e4c47f;
  }
  .accordion-content {
    max-width: 520px;
    padding: 0 0 24px 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.58);
    line-height: 1.75;
  }
`;

const Detail_Produk: React.FC = () => {
    const [isPageReady, setIsPageReady] = useState(false);
    const productSlug = getCurrentProductSlug();
    const productInfo = getStudioProductBySlug(productSlug);
    const initialVariant = productInfo?.variants[0];
    const [selectedColor, setSelectedColor] = useState<string>(initialVariant?.id ?? '');
    const [selectedSize, setSelectedSize] = useState<string>(productInfo?.sizes[0] ?? '');
    const [activeImage, setActiveImage] = useState<number>(0);
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [actionMessage, setActionMessage] = useState("");
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const animationFrame = window.requestAnimationFrame(() => {
            setIsPageReady(true);
        });

        return () => window.cancelAnimationFrame(animationFrame);
    }, []);

    if (!productInfo || !initialVariant) {
        return (
            <div className={`detail-produk-page ${isPageReady ? 'is-ready' : ''}`}>
                <style data-component="detail-produk">{detailProdukStyles}</style>
                <StudioNavbar />
                <div className="detail-produk-container">
                    <div className="size-guide-panel" role="alert">
                        Produk yang Anda buka tidak tersedia. Silakan kembali ke koleksi Mahreen Studio.
                    </div>
                    <button className="btn-primary" type="button" onClick={() => navigateToHashRoute('/mahreen-studio/latest-collection')}>
                        Lihat Koleksi
                    </button>
                </div>
            </div>
        );
    }

    const colors = productInfo.variants.map((variant) => ({
        id: variant.id,
        name: variant.label,
        hex: variant.hex,
        image: variant.image,
    }));
    const sizes = [...productInfo.sizes];
    const currentColorObj = colors.find((color) => color.id === selectedColor) || colors[0];

    const productImages = [
        { src: currentColorObj.image, alt: `${productInfo.title} ${currentColorObj.name}` },
    ];

    const toggleAccordion = (section: string) => {
        setOpenAccordion(openAccordion === section ? null : section);
    };

    const saveProductToCart = () => {
        addStudioCartItem({
            productSlug: productInfo.slug,
            productTitle: productInfo.title,
            color: selectedColor,
            colorLabel: currentColorObj.name,
            size: selectedSize,
            productSku: productInfo.sku,
            productImage: currentColorObj.image,
            quantity: 1,
            price: productInfo.price,
        });
        setActionMessage(`${productInfo.title} ditambahkan ke keranjang.`);
    };

    const handleBuyNow = () => {
        selectStudioBuyNowItem({
            productSlug: productInfo.slug,
            productSku: productInfo.sku,
            productTitle: productInfo.title,
            productImage: currentColorObj.image,
            color: selectedColor,
            colorLabel: currentColorObj.name,
            size: selectedSize,
            quantity: 1,
            price: productInfo.price,
        });
        const targetPath = "/mahreen-studio/order-summary";
        if (!isAuthenticated) {
            navigateToHashRoute(getLoginRedirectRoute(targetPath));
        } else {
            navigateToHashRoute(targetPath);
        }
    };

    return (
        <div className={`detail-produk-page ${isPageReady ? 'is-ready' : ''}`}>
            <style data-component="detail-produk">{detailProdukStyles}</style>

            {/* KITA PASANG NAVBAR-NYA DI SINI */}
            <StudioNavbar />

            {/* SECTION ATAS: DETAIL & OPSI PRODUK */}
            <div className="detail-produk-container">
                <nav className="product-breadcrumb" aria-label="Breadcrumb produk">
                    <a href="/mahreen-studio">Mahreen Studio</a>
                    <span className="product-breadcrumb__separator" aria-hidden="true">/</span>
                    <a href="/mahreen-studio/latest-collection?section=featured-pieces">Collection</a>
                    <span className="product-breadcrumb__separator" aria-hidden="true">/</span>
                    <span aria-current="page">{productInfo.title}</span>
                </nav>

                <div className="product-grid">

                    {/* KIRI: Galeri Foto */}
                    <div className="gallery-section">
                        <div className="thumbnails">
                            {productImages.map((imgObj, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`thumbnail-btn ${activeImage === idx ? 'active' : ''}`}
                                    onClick={() => setActiveImage(idx)}
                                >
                                    <img width="800" height="1000" src={imgObj.src} alt={imgObj.alt} loading="lazy" decoding="async" />
                                </button>
                            ))}
                        </div>

                        <div className="main-image">
                            <img width="800" height="1000" key={`${productInfo.slug}-${selectedColor}-${activeImage}`} src={productImages[activeImage].src} alt={productImages[activeImage].alt} loading="eager" decoding="async" />
                        </div>
                    </div>

                    {/* KANAN: Opsi Belanja */}
                    <div className="info-section">
                        <span className="collection-label">{productInfo.collection}</span>
                        <h1 className="product-title">{productInfo.title}</h1>
                        <div className="product-price">{formatStudioPrice(productInfo.price)}</div>

                        {/* Pilih Warna */}
                        <div className="section-title">Warna: {currentColorObj.name}</div>
                        <div className="color-picker">
                            {colors.map((color) => (
                                <button
                                    key={color.id}
                                    type="button"
                                    className={`color-option ${selectedColor === color.id ? 'active' : ''}`}
                                    style={{ backgroundColor: color.hex }}
                                    onClick={() => {
                                        setSelectedColor(color.id);
                                        setActiveImage(0);
                                    }}
                                    title={color.name}
                                />
                            ))}
                        </div>

                        {/* Pilih Ukuran */}
                        <div className="size-block">
                            <div className="size-header">
                                <p className="size-label">Select Size</p>
                                <button
                                    className="size-guide"
                                    type="button"
                                    aria-expanded={showSizeGuide}
                                    onClick={() => setShowSizeGuide((currentValue) => !currentValue)}
                                >
                                    Size Guide
                                </button>
                            </div>

                            {showSizeGuide ? (
                                <div className="size-guide-panel">
                                    S: lebar 52 cm · M: 55 cm · L: 58 cm · XL: 61 cm. Ukuran dapat berbeda 1–2 cm karena proses produksi.
                                </div>
                            ) : null}

                            <div className="size-picker" role="group" aria-label="Select product size">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        className={`size-option ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                        aria-pressed={selectedSize === size}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="action-buttons">
                            <button className="btn-primary" type="button" onClick={saveProductToCart}>
                                Tambah ke Keranjang
                            </button>
                            <button className="btn-secondary" type="button" onClick={handleBuyNow}>
                                Beli Sekarang
                            </button>
                        </div>

                        {actionMessage ? (
                            <p className="purchase-feedback" role="status" aria-live="polite">
                                {actionMessage}
                            </p>
                        ) : null}

                        {/* Product Info Accordion */}
                        <div className="product-accordion">
                            <div className="accordion-item">
                                <button
                                    className="accordion-header"
                                    type="button"
                                    onClick={() => toggleAccordion('material')}
                                    aria-expanded={openAccordion === 'material'}
                                >
                                    <span>Material &amp; Care</span>
                                    <span className={`accordion-icon ${openAccordion === 'material' ? 'is-open' : ''}`} aria-hidden="true">⌄</span>
                                </button>
                                {openAccordion === 'material' && (
                                    <div className="accordion-content">
                                        Crafted from premium heavyweight cotton with a structured silhouette and soft loopback interior.
                                        Wash cold, inside out, with similar colors. Do not bleach. Dry flat to keep the garment shape clean and durable.
                                    </div>
                                )}
                            </div>

                            <div className="accordion-item">
                                <button
                                    className="accordion-header"
                                    type="button"
                                    onClick={() => toggleAccordion('shipping')}
                                    aria-expanded={openAccordion === 'shipping'}
                                >
                                    <span>Shipping &amp; Returns</span>
                                    <span className={`accordion-icon ${openAccordion === 'shipping' ? 'is-open' : ''}`} aria-hidden="true">⌄</span>
                                </button>
                                {openAccordion === 'shipping' && (
                                    <div className="accordion-content">
                                        Orders are processed within 1–3 business days. Returns are accepted within 7 days after delivery as long as the item is unused, unwashed, and all original tags remain attached.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* SUB-SECTIONS BAWAH */}
            <Creative_process />
            <Experience />
            <ClosingSection />
            <Footer />
        </div>
    );
};

export default Detail_Produk;
