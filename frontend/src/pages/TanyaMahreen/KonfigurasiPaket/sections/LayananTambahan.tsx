import { Check } from "lucide-react";

import type { PackageAddOn } from "../packageTypes";

const layananTambahanStyles = `
  .kp-addons {
    padding-bottom: 10px;
  }

  .kp-addons__heading {
    display: flex;
    margin-bottom: 30px;
    align-items: center;
    gap: 25px;
  }

  .kp-addons__title {
    margin: 0;
    color: #eee9e0;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 27px;
    font-weight: 500;
    white-space: nowrap;
  }

  .kp-addons__rule {
    width: 100%;
    height: 1px;
    background: #292929;
  }

  .kp-addons__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 26px;
  }

  .kp-addon {
    display: flex;
    min-height: 135px;
    padding: 28px 30px;
    align-items: flex-start;
    gap: 20px;
    border: 1px solid var(--kp-border);
    background: linear-gradient(180deg, #121212 0%, #101010 100%);
    color: inherit;
    text-align: left;
    cursor: pointer;
    transition: border-color .25s ease, transform .25s ease, background .25s ease, box-shadow .25s ease;
  }

  .kp-addon:hover {
    border-color: #514735;
    transform: translateY(-3px);
    box-shadow: 0 0 24px rgba(201,169,121,.08);
  }

  .kp-addon.is-selected {
    border-color: var(--kp-gold);
    background: linear-gradient(135deg, rgba(201,169,121,.07), #111 40%);
    box-shadow: 0 0 24px rgba(201,169,121,.09);
  }

  .kp-addon__box {
    display: grid;
    width: 21px;
    height: 21px;
    margin-top: 1px;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid #505050;
    color: #111;
    transition: border-color .2s ease, background .2s ease;
  }

  .kp-addon.is-selected .kp-addon__box {
    border-color: var(--kp-gold);
    background: var(--kp-gold);
  }

  .kp-addon__box svg {
    width: 13px;
    height: 13px;
    stroke-width: 2;
  }

  .kp-addon__copy {
    flex: 1;
  }

  .kp-addon__name {
    display: block;
    margin: 0 0 7px;
    color: #e8e3dc;
    font-size: 14px;
    font-weight: 600;
  }

  .kp-addon__description {
    display: block;
    margin: 0 0 13px;
    color: #716e69;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.5;
  }

  .kp-addon__price {
    display: block;
    margin: 0;
    color: var(--kp-gold);
    font-family: "DM Mono", monospace;
    font-size: 14px;
  }

  @media (max-width: 760px) {
    .kp-addons__grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .kp-addons__heading {
      gap: 15px;
    }

    .kp-addons__title {
      font-size: 24px;
    }

    .kp-addon {
      min-height: 125px;
      padding: 24px 21px;
    }
  }
`;

type LayananTambahanProps = {
  addOns: PackageAddOn[];
  selected: string[];
  onToggle: (id: string) => void;
};

const LayananTambahan = ({
  addOns,
  selected,
  onToggle,
}: LayananTambahanProps) => (
  <section className="kp-addons" aria-labelledby="layanan-tambahan-title">
    <style data-component="layanan-tambahan">{layananTambahanStyles}</style>

    <div className="kp-addons__heading">
      <h2 id="layanan-tambahan-title" className="kp-addons__title">
        Layanan Tambahan
      </h2>
      <span className="kp-addons__rule" aria-hidden="true" />
    </div>

    <div className="kp-addons__grid">
      {addOns.map((addOn) => {
        const isSelected = selected.includes(addOn.id);

        return (
          <button
            key={addOn.id}
            type="button"
            className={`kp-addon ${isSelected ? "is-selected" : ""}`}
            aria-pressed={isSelected}
            onClick={() => onToggle(addOn.id)}
          >
            <span className="kp-addon__box" aria-hidden="true">
              {isSelected && <Check />}
            </span>
            <span className="kp-addon__copy">
              <span className="kp-addon__name">{addOn.title}</span>
              <span className="kp-addon__description">{addOn.description}</span>
              <span className="kp-addon__price">{addOn.priceLabel}</span>
            </span>
          </button>
        );
      })}
    </div>
  </section>
);

export default LayananTambahan;
