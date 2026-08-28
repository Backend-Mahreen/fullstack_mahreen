import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import type { AdminModuleKey, AdminTransaction } from "../types";

type RecentTransactionsProps = Readonly<{
  onSelect: (module: AdminModuleKey) => void;
  query: string;
  transactions: readonly AdminTransaction[];
}>;

const RecentTransactions = ({ onSelect, query, transactions: sourceTransactions }: RecentTransactionsProps) => {
  const normalizedQuery = query.trim().toLowerCase();
  const transactions = normalizedQuery
    ? sourceTransactions.filter((transaction) =>
        Object.values(transaction).some((value) => value.toLowerCase().includes(normalizedQuery)))
    : sourceTransactions;

  return (
    <article className="admin-panel admin-transactions admin-animate" style={{ "--admin-delay": "585ms" } as CSSProperties}>
      <div className="admin-panel__heading">
        <div><h2>Recent Transactions</h2><p>Invoice dan pembayaran terbaru</p></div>
        <button className="admin-link-button" type="button" onClick={() => onSelect("transactions")}>
          View All Activities <ArrowUpRight size={13} aria-hidden="true" />
        </button>
      </div>
      {transactions.length ? (
        <div className="admin-table-scroll">
          <table className="admin-data-table">
            <thead><tr><th>Invoice ID</th><th>Client Name</th><th>Service</th><th>Nominal</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.invoice}>
                  <td>{transaction.invoice}</td>
                  <td>{transaction.client}</td>
                  <td>{transaction.service}</td>
                  <td className="admin-data-table__amount">{transaction.amount}</td>
                  <td><span className={`admin-status admin-status--${transaction.status.toLowerCase()}`}>{transaction.status}</span></td>
                  <td>{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <div className="admin-empty-state">Tidak ada transaksi yang cocok dengan “{query}”.</div>}
    </article>
  );
};

export default RecentTransactions;
