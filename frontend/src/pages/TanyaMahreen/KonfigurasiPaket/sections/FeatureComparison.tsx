import { Check, X } from "lucide-react";

import type {
  ComparisonValue,
  PackageComparisonRow,
  TierId,
} from "../packageTypes";

const tierColumns: TierId[] = ["professional", "business", "enterprise"];

const featureComparisonStyles = `
  .kp-comparison {
    overflow: hidden;
    padding: 40px 41px 34px;
    border: 1px solid var(--kp-border);
    background: linear-gradient(180deg, #121212 0%, #101010 100%);
  }

  .kp-comparison__title {
    margin: 0 0 39px;
    color: #eee9e0;
    font-family: "Playfair Display", Georgia, serif;
    font-size: 27px;
    font-weight: 500;
  }

  .kp-comparison__scroll {
    overflow-x: auto;
  }

  .kp-comparison__table {
    width: 100%;
    min-width: 760px;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .kp-comparison__table th {
    padding: 0 20px 21px;
    color: #625f5b;
    font-family: "DM Mono", monospace;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: .17em;
    text-align: center;
    text-transform: uppercase;
  }

  .kp-comparison__table th:first-child {
    width: 30%;
    padding-left: 0;
    text-align: left;
  }

  .kp-comparison__table th.is-selected {
    color: var(--kp-gold);
  }

  .kp-comparison__table td {
    height: 67px;
    padding: 17px 20px;
    border-top: 1px solid #292929;
    color: #88847e;
    font-size: 14px;
    font-weight: 300;
    text-align: center;
  }

  .kp-comparison__table td:first-child {
    padding-left: 0;
    color: #aaa59f;
    text-align: left;
  }

  .kp-comparison__table td.is-selected {
    background: linear-gradient(90deg, transparent, rgba(201,169,121,.025), transparent);
    color: #b7b0a7;
  }

  .kp-comparison__icon {
    width: 15px;
    height: 15px;
    stroke-width: 1.5;
  }

  .kp-comparison__icon.is-check {
    color: var(--kp-gold);
  }

  .kp-comparison__icon.is-cross {
    color: #454545;
  }

  @media (max-width: 640px) {
    .kp-comparison {
      padding: 30px 22px 25px;
    }

    .kp-comparison__title {
      margin-bottom: 28px;
      font-size: 24px;
    }
  }
`;

const renderCell = (value: ComparisonValue) => {
  if (value === true) {
    return <Check className="kp-comparison__icon is-check" aria-label="Tersedia" />;
  }

  if (value === false) {
    return <X className="kp-comparison__icon is-cross" aria-label="Tidak tersedia" />;
  }

  return value;
};

type FeatureComparisonProps = {
  selectedTier: TierId;
  rows: PackageComparisonRow[];
  title?: string;
};

const FeatureComparison = ({
  selectedTier,
  rows,
  title = "Feature Comparison",
}: FeatureComparisonProps) => (
  <section className="kp-comparison" aria-labelledby="feature-comparison-title">
    <style data-component="feature-comparison">{featureComparisonStyles}</style>

    <h2 id="feature-comparison-title" className="kp-comparison__title">
      {title}
    </h2>

    <div className="kp-comparison__scroll">
      <table className="kp-comparison__table">
        <thead>
          <tr>
            <th>Features</th>
            <th className={selectedTier === "professional" ? "is-selected" : ""}>
              Professional
            </th>
            <th className={selectedTier === "business" ? "is-selected" : ""}>
              Business
            </th>
            <th className={selectedTier === "enterprise" ? "is-selected" : ""}>
              Enterprise
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              {tierColumns.map((column) => (
                <td
                  key={column}
                  className={selectedTier === column ? "is-selected" : ""}
                >
                  {renderCell(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default FeatureComparison;