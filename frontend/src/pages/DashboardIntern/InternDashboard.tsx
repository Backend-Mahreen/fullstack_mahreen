import { useEffect, useState } from "react";
import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  UserRound,
} from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../hooks/useAuth";
import { navigateToRoute } from "../../utils/hashNavigation";
import { apiClient } from "../../api/apiClient";
import { API_ENDPOINTS } from "../../api/endpoints";

import styles from "./InternDashboard.module.css";

const modules = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "learning", label: "Learning", icon: BookOpen },
  { key: "assignment", label: "Assignment", icon: ClipboardList },
  { key: "project", label: "Project", icon: BriefcaseBusiness },
  { key: "mentoring", label: "Mentoring", icon: MessageCircle },
  { key: "certificate", label: "Certificate", icon: Award },
  { key: "profile", label: "Profile", icon: UserRound },
] as const;

type ModuleKey = (typeof modules)[number]["key"];

type InternshipApplication = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  university: string;
  major: string;
  semester: number;
  specialization: string;
  motivation: string;
  portfolioUrl: string;
  cvUrl: string;
  motivationLetterUrl: string;
  batchId: string;
  status: string;
  reviewedAt: string;
  adminNotes: string;
  createdAt: string;
};

type InternshipBatch = {
  id: string;
  name: string;
  status: string;
  description: string;
  quota: number;
  startDate: string;
  endDate: string;
  mentorName: string;
  createdAt: string;
};

type Certificate = {
  id: string;
  certificateNumber: string;
  programType: string;
  programName: string;
  status: string;
  issuedAt: string;
};

type ApplicationsResponse = {
  items: InternshipApplication[];
  total: number;
};

type BatchesResponse = {
  items: InternshipBatch[];
  total: number;
};

type CertificatesResponse = {
  items: Certificate[];
  total: number;
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Menunggu Review",
  screening: "Sedang Diseleksi",
  interview: "Wawancara",
  accepted: "Diterima",
  rejected: "Ditolak",
  withdrawn: "Ditarik Kembali",
};

const buildModuleContent = (
  application: InternshipApplication | null,
  batch: InternshipBatch | null,
  certificates: Certificate[],
): Record<ModuleKey, { title: string; description: string; items: string[] }> => {
  const statusLabel = application ? STATUS_LABELS[application.status] || application.status : "Belum ada aplikasi";
  const batchName = batch?.name || "Belum ditentukan";
  const mentor = batch?.mentorName || "Belum ditentukan";
  const specialization = application?.specialization || "-";

  const acceptedCerts = certificates.filter((c) => c.status === "issued");
  const certItems = certificates.length > 0
    ? certificates.map((c) => `${c.programName || c.programType}, ${c.status === "issued" ? "Tersedia" : "Terkunci"}`)
    : ["Belum ada sertifikat"];

  return {
    overview: {
      title: "Internship Overview",
      description: `Status aplikasi: ${statusLabel}. Batch: ${batchName}. Spesialisasi: ${specialization}.`,
      items: [
        `Status: ${statusLabel}`,
        `Batch: ${batchName}`,
        `Spesialisasi: ${specialization}`,
        `Mentor: ${mentor}`,
      ],
    },
    learning: {
      title: "Learning Path",
      description: "Materi terstruktur untuk membangun kompetensi inti.",
      items: [
        "Ecosystem Orientation",
        "Professional Communication",
        "Digital Project Management",
        `${specialization !== "-" ? specialization : "Specialization Module"}`,
      ],
    },
    assignment: {
      title: "Assignments",
      description: "Daftar tugas dan status pengumpulan.",
      items: [
        "Personal Development Plan, Completed",
        "Market Research Brief, In Review",
        "Weekly Reflection, Due Friday",
        "Portfolio Documentation, Upcoming",
      ],
    },
    project: {
      title: "Real Project",
      description: "Proyek praktik yang dikerjakan bersama mentor dan tim.",
      items: [
        "Discovery completed",
        "Research completed",
        "Design in progress",
        "Testing scheduled",
        "Final presentation upcoming",
      ],
    },
    mentoring: {
      title: "Mentoring",
      description: "Jadwal, catatan, dan tindak lanjut sesi mentoring.",
      items: [
        `Mentor: ${mentor}`,
        "Weekly group mentoring",
        "One-on-one review",
        "Project feedback clinic",
        "Career preparation session",
      ],
    },
    certificate: {
      title: "Certificates",
      description: `Anda memiliki ${acceptedCerts.length} sertifikat yang diterbitkan.`,
      items: certItems,
    },
    profile: {
      title: "Intern Profile",
      description: "Kelola data profil melalui pusat akun Mahreen.",
      items: [
        `Nama: ${application?.fullName || "-"}`,
        `Universitas: ${application?.university || "-"}`,
        `Semester: ${application?.semester || "-"}`,
        "Portfolio and social links",
      ],
    },
  };
};

const InternDashboard = () => {
  const { user, logout } = useAuth();
  const [activeModule, setActiveModule] = useState<ModuleKey>("overview");
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [batch, setBatch] = useState<InternshipBatch | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, certsRes] = await Promise.allSettled([
          apiClient<ApplicationsResponse>(API_ENDPOINTS.clientInternshipApplications.list),
          apiClient<CertificatesResponse>(API_ENDPOINTS.clientCertificates.list),
        ]);

        const apps = appsRes.status === "fulfilled" ? appsRes.value : { items: [] as InternshipApplication[], total: 0 };
        const certs = certsRes.status === "fulfilled" ? certsRes.value : { items: [] as Certificate[], total: 0 };

        setApplications(apps.items);
        setCertificates(certs.items);

        const activeBatchId = apps.items[0]?.batchId;
        if (activeBatchId) {
          try {
            const batchesRes = await apiClient<BatchesResponse>(API_ENDPOINTS.internships.batches);
            const foundBatch = batchesRes.items.find((b) => b.id === activeBatchId);
            if (foundBatch) setBatch(foundBatch);
          } catch {
            // Batch fetch gagal, lanjut tanpa data batch
          }
        }
      } catch {
        // Semua fetch gagal, tampilkan data kosong
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const application = applications[0] || null;
  const moduleContent = buildModuleContent(application, batch, certificates);
  const content = moduleContent[activeModule];

  const handleLogout = async () => {
    await logout();
    navigateToRoute("/login");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles["intern-page"]}>
          <div className={styles["intern-shell"]}>
            <aside className={styles["intern-sidebar"]}>
              <h2>INTERNSHIP DASHBOARD</h2>
            </aside>
            <section className={styles["intern-main"]}>
              <header className={styles["intern-header"]}>
                <p>Memuat data...</p>
              </header>
            </section>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles["intern-page"]}>
        <div className={styles["intern-shell"]}>
          <aside className={styles["intern-sidebar"]}>
            <h2>INTERNSHIP DASHBOARD</h2>
            <nav className={styles["intern-nav"]} aria-label="Menu internship dashboard">
              {modules.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  className={activeModule === key ? "is-active" : ""}
                  onClick={() => setActiveModule(key)}
                >
                  <Icon size={17} />
                  {label}
                </button>
              ))}
              <button className={styles["intern-logout"]} type="button" onClick={handleLogout}>
                <LogOut size={17} />
                Logout
              </button>
            </nav>
          </aside>

          <section className={styles["intern-main"]}>
            <header className={styles["intern-header"]}>
              <p>Selamat datang, {application?.fullName || user?.nickname || user?.fullName || "Mahreen Talent"}</p>
              <h1>{content.title}</h1>
            </header>
            <div className={styles["intern-kpis"]}>
              <article className={styles["intern-kpi"]}>
                <span>Status</span>
                <strong>{STATUS_LABELS[application?.status || ""] || "-"}</strong>
              </article>
              <article className={styles["intern-kpi"]}>
                <span>Batch</span>
                <strong>{batch?.name || "-"}</strong>
              </article>
              <article className={styles["intern-kpi"]}>
                <span>Spesialisasi</span>
                <strong>{application?.specialization || "-"}</strong>
              </article>
              <article className={styles["intern-kpi"]}>
                <span>Sertifikat</span>
                <strong>{certificates.filter((c) => c.status === "issued").length} / {certificates.length}</strong>
              </article>
            </div>

            <div className={styles["intern-content"]}>
              <article className={styles["intern-panel"]}>
                <h2>{content.title}</h2>
                <p>{content.description}</p>
                <div className={styles["intern-list"]}>
                  {content.items.map((item) => (
                    <div className={styles["intern-item"]} key={item}>
                      <CheckCircle2 size={17} />
                      {item}
                    </div>
                  ))}
                </div>
                {activeModule === "profile" && (
                  <a className={styles["intern-profile-link"]} href="/akun/edit">
                    Edit Profile
                  </a>
                )}
              </article>
              <aside className="intern-panel intern-progress">
                <h2>Batch Progress</h2>
                <div
                  className={styles["intern-progress__ring"]}
                  aria-label={`Progres batch ${
                    application?.status === "accepted" ? "100" : "50"
                  } persen`}
                />
                <p>Terus selesaikan modul, tugas, dan milestone proyek.</p>
              </aside>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default InternDashboard;
