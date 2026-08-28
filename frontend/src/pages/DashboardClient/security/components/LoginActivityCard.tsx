import type { ClientLoginRecord } from "../../../../services/security/clientSecurityRepository";
import { formatSecurityTime } from "../securityFormatting";

type LoginActivityCardProps = Readonly<{
  records: ClientLoginRecord[];
}>;

const LoginActivityCard = ({ records }: LoginActivityCardProps) => (
  <section className="client-security-card client-security-login">
    <h2>Aktivitas Login</h2>
    <div className="client-security-login__table-wrap">
      <table>
        <thead>
          <tr>
            <th>Waktu</th>
            <th>Status</th>
            <th>Alamat IP</th>
            <th>Lokasi</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.id}>
              <td>{formatSecurityTime(record.occurredAt)}</td>
              <td>
                <span className={`client-security-login__status is-${record.status.toLowerCase()}`}>
                  <i aria-hidden="true" />
                  {record.status}
                </span>
              </td>
              <td>{record.ip}</td>
              <td>{record.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default LoginActivityCard;
