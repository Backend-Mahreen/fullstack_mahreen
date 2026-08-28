import { useState } from "react";
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


import styles from "./InternDashboard.module.css";const modules = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "learning", label: "Learning", icon: BookOpen },
  { key: "assignment", label: "Assignment", icon: ClipboardList },
  { key: "project", label: "Project", icon: BriefcaseBusiness },
  { key: "mentoring", label: "Mentoring", icon: MessageCircle },
  { key: "certificate", label: "Certificate", icon: Award },
  { key: "profile", label: "Profile", icon: UserRound },
] as const;

type ModuleKey = (typeof modules)[number]["key"];

const moduleContent: Record<ModuleKey, { title: string; description: string; items: string[] }> = {
  overview: { title: "Internship Overview", description: "Ringkasan progres program, tugas, proyek, dan jadwal mentoring.", items: ["Learning progress 68%", "3 assignments completed", "Project milestone 2 of 5", "Next mentoring: Friday, 15:00 WIB"] },
  learning: { title: "Learning Path", description: "Materi terstruktur untuk membangun kompetensi inti.", items: ["Ecosystem Orientation", "Professional Communication", "Digital Project Management", "Specialization Module"] },
  assignment: { title: "Assignments", description: "Daftar tugas dan status pengumpulan.", items: ["Personal Development Plan, Completed", "Market Research Brief, In Review", "Weekly Reflection, Due Friday", "Portfolio Documentation, Upcoming"] },
  project: { title: "Real Project", description: "Proyek praktik yang dikerjakan bersama mentor dan tim.", items: ["Discovery completed", "Research completed", "Design in progress", "Testing scheduled", "Final presentation upcoming"] },
  mentoring: { title: "Mentoring", description: "Jadwal, catatan, dan tindak lanjut sesi mentoring.", items: ["Weekly group mentoring", "One-on-one review", "Project feedback clinic", "Career preparation session"] },
  certificate: { title: "Certificates", description: "Sertifikat tersedia setelah seluruh persyaratan terpenuhi.", items: ["Orientation Certificate, Available", "Specialization Certificate, Locked", "Internship Completion Certificate, Locked"] },
  profile: { title: "Intern Profile", description: "Kelola data profil melalui pusat akun Mahreen.", items: ["Personal identity", "Academic information", "Portfolio and social links", "Notification preferences"] },
};



const InternDashboard = () => {
  const { user, logout } = useAuth();
  const [activeModule, setActiveModule] = useState<ModuleKey>("overview");
  const content = moduleContent[activeModule];

  const handleLogout = async () => {
    await logout();
    navigateToRoute("/login");
  };

  return (
    <>
      <Navbar />
      <main className={styles["intern-page"]}>
        <div className={styles["intern-shell"]}>
          <aside className={styles["intern-sidebar"]}>
            <h2>INTERNSHIP DASHBOARD</h2>
            <nav className={styles["intern-nav"]} aria-label="Menu internship dashboard">
              {modules.map(({ key, label, icon: Icon }) => <button key={key} type="button" className={activeModule === key ? "is-active" : ""} onClick={() => setActiveModule(key)}><Icon size={17} />{label}</button>)}
              <button className={styles["intern-logout"]} type="button" onClick={handleLogout}><LogOut size={17} />Logout</button>
            </nav>
          </aside>

          <section className={styles["intern-main"]}>
            <header className={styles["intern-header"]}><p>Selamat datang, {user?.nickname || user?.fullName || "Mahreen Talent"}</p><h1>{content.title}</h1></header>
            <div className={styles["intern-kpis"]}>
              <article className={styles["intern-kpi"]}><span>Learning</span><strong>68%</strong></article>
              <article className={styles["intern-kpi"]}><span>Assignments</span><strong>3/5</strong></article>
              <article className={styles["intern-kpi"]}><span>Project Steps</span><strong>2/5</strong></article>
              <article className={styles["intern-kpi"]}><span>Mentoring</span><strong>4 Sessions</strong></article>
            </div>

            <div className={styles["intern-content"]}>
              <article className={styles["intern-panel"]}>
                <h2>{content.title}</h2><p>{content.description}</p>
                <div className={styles["intern-list"]}>{content.items.map((item) => <div className={styles["intern-item"]} key={item}><CheckCircle2 size={17} />{item}</div>)}</div>
                {activeModule === "profile" && <a className={styles["intern-profile-link"]} href="/akun/edit">Edit Profile</a>}
              </article>
              <aside className="intern-panel intern-progress"><h2>Batch Progress</h2><div className={styles["intern-progress__ring"]} aria-label="Progres batch 68 persen" /><p>Terus selesaikan modul, tugas, dan milestone proyek.</p></aside>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default InternDashboard;
