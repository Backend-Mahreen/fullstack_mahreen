import React from "react";

// 1. Perbaikan Path Import (mundur 1 folder menggunakan ../)
import iconInternship from "../../../assets/HelpCenter/internship.png";
import iconTanya from "../../../assets/HelpCenter/Tanya Mahreen icon.png";
import iconStudio from "../../../assets/HelpCenter/Mahreen Studio.png";
import iconCsr from "../../../assets/HelpCenter/Mahreen CSR.png";
import iconPeduli from "../../../assets/HelpCenter/Peduli Mahreen.png";
import iconNews from "../../../assets/HelpCenter/Newsroom.png";
import iconPortal from "../../../assets/HelpCenter/Client Portal.png";
import iconVerify from "../../../assets/HelpCenter/Verification.png";

const LayananUtama: React.FC = () => {
  const services = [
    { title: "Internship", desc: "Program karir mahasiswa", icon: iconInternship, href: "/internship" },
    { title: "Tanya Mahreen", desc: "Bantuan & Diskusi", icon: iconTanya, href: "/tanya-mahreen" },
    { title: "Mahreen Studio", desc: "Layanan Kreatif & Desain", icon: iconStudio, href: "/mahreen-studio" },
    { title: "Mahreen CSR", desc: "Program Filantropi", icon: iconCsr, href: "/mahreen-csr" },
    { title: "Peduli Mahreen", desc: "Layanan Sosial", icon: iconPeduli, href: "/peduli-mahreen" },
    { title: "Newsroom", desc: "Berita Terkini", icon: iconNews, href: "/newsroom" },
    { title: "Client Portal", desc: "Manajemen Proyek", icon: iconPortal, href: "/client-portal"},
    { title: "Verification", desc: "Cek Keaslian Sertifikat", icon: iconVerify, href: "/newsroom/verifikasi-dokumen"}
  ];

  return (
    <section className="hc-grid-8">
      {services.map((svc) => (
        <a href={svc.href} key={svc.title} className="hc-service-card">
          {/* 3. Ubah <span> menjadi <img decoding="async" loading="lazy"> agar file PNG bisa di-render */}
          <img width="40" height="40" decoding="async" loading="lazy" 
            src={svc.icon} 
            alt={`Icon ${svc.title}`} 
            className="hc-service-icon" 
            style={{ width: "40px", height: "40px", objectFit: "contain", marginBottom: "12px" }} 
          />
          <h3>{svc.title}</h3>
          <p>{svc.desc}</p>
        </a>
      ))}
    </section>
  );
};

export default LayananUtama;
