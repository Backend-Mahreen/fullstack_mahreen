import { Fragment } from "react";
import dzikriImage from "../../../assets/Tentang-Mahreen/profile-founder.jpeg";
import taniaImage from "../../../assets/Tentang-Mahreen/profile-ceo.webp";

const founders = [
  {
    name: "Mohamad Dzikri\nArfiansyah, S.T.",
    role: "Founder",
    company: "Mahreen Indonesia",
    className: "profile-section__founder--first",
    image: dzikriImage,
  },
  {
    name: "Tania Restiani Fajar",
    role: "Chief Executive Officer",
    company: "Mahreen Indonesia",
    className: "profile-section__founder--second",
    image: taniaImage,
  },
] as const;

const profileSectionStyles = `
  .profile-section {
    width: min(100%, 1272px);
    margin: 0 auto;
    padding: 159px 0 0;
    border-bottom: 1px solid var(--tentang-border);
  }

  .profile-section__hero {
    width: min(100%, 679px);
    margin: 0 auto;
    text-align: center;
  }

  .profile-section__eyebrow {
    color: var(--tentang-gold);
    font-size: 14px;
    font-weight: 700;
    line-height: 15px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .profile-section__title {
    padding-top: 16px;
    color: var(--tentang-white);
    font-family: "Playfair Display", Georgia, serif;
    font-size: 72px;
    font-style: italic;
    font-weight: 400;
    line-height: 72px;
    letter-spacing: 0;
  }

  .profile-section__description {
    width: min(100%, 672px);
    margin: 0 auto;
    padding-top: 24px;
    color: var(--tentang-muted);
    font-size: 18px;
    font-weight: 300;
    line-height: 28px;
  }

  .profile-section__content {
    width: 100%;
    padding: 96px 48px;
  }

  .profile-section__card {
    display: grid;
    grid-template-columns: minmax(0, 499px) minmax(0, 499px);
    justify-content: space-between;
    gap: 64px;
    width: 100%;
    min-height: 895px;
    padding: 56px 56px 56px 57px;
    overflow: hidden;
    background: var(--tentang-panel);
    border: 1px solid var(--tentang-border);
    border-radius: 24px;
  }

  .profile-section__card-left {
    width: 100%;
    max-width: 499px;
  }

  .profile-section__card-heading {
    width: min(100%, 459px);
    padding-top: 16px;
    color: var(--tentang-white);
    font-family: "Playfair Display", Georgia, serif;
    font-size: 36px;
    font-weight: 400;
    line-height: 40px;
  }

  .profile-section__quote {
    width: 100%;
    margin-top: 24px;
    padding-left: 16px;
    border-left: 2px solid rgba(197, 168, 128, 0.4);
  }

  .profile-section__quote p {
    width: min(100%, 482px);
    color: var(--tentang-muted);
    font-size: 18px;
    font-style: italic;
    font-weight: 300;
    line-height: 28px;
  }

  .profile-section__card-right {
    width: 100%;
    max-width: 499px;
  }

  .profile-section__copy {
    color: var(--tentang-muted);
    font-size: 16px;
    font-weight: 400;
    line-height: 26px;
  }

  .profile-section__copy + .profile-section__copy {
    margin-top: 20px;
  }

  .profile-section__copy strong {
    color: var(--tentang-white);
    font-weight: 500;
  }

  .profile-section__founders {
    display: flex;
    align-items: flex-start;
    gap: 32px;
    width: 100%;
    margin-top: 20px;
    padding-top: 32px;
    border-top: 1px solid var(--tentang-border);
  }

  .profile-section__founder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .profile-section__founder--first {
    width: 105px;
  }

  .profile-section__founder--second {
    width: 153px;
  }

  .profile-section__avatar {
    width: 80px;
    height: 80px;
    overflow: hidden;
    object-fit: cover;
    border: 1px solid var(--tentang-gold-border);
    border-radius: 9999px;
    background: radial-gradient(
      circle at 50% 42%,
      rgba(197, 168, 128, 0.06),
      rgba(17, 17, 17, 0) 58%
    );
  }

  .profile-section__founder-name {
    color: var(--tentang-white);
    font-size: 14px;
    font-weight: 500;
    line-height: 19px;
    text-align: center;
    white-space: pre-line;
  }

  .profile-section__founder-role {
    padding-top: 4px;
    color: var(--tentang-gold);
    font-size: 14px;
    font-weight: 700;
    line-height: 16px;
    letter-spacing: 1px;
    text-align: center;
    text-transform: uppercase;
  }

  .profile-section__founder-company {
    padding-top: 2px;
    color: #8c8c8c;
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    text-align: center;
  }

  .profile-section__divider {
    width: 1px;
    height: 64px;
    margin-top: 53px;
    background: var(--tentang-border);
  }

  @media (max-width: 1280px) {
    .profile-section {
      width: 100%;
      padding-top: 132px;
    }

    .profile-section__content {
      padding-right: clamp(20px, 3.75vw, 48px);
      padding-left: clamp(20px, 3.75vw, 48px);
    }
  }

  @media (max-width: 1120px) {
    .profile-section__card {
      grid-template-columns: 1fr;
      min-height: 0;
      gap: 56px;
      padding: 48px;
    }

    .profile-section__card-left,
    .profile-section__card-right {
      max-width: none;
    }
  }

  @media (max-width: 768px) {
    .profile-section {
      padding-top: 112px;
    }

    .profile-section__hero {
      padding: 0 20px;
    }

    .profile-section__title {
      font-size: clamp(44px, 10vw, 60px);
      line-height: 0.98;
    }

    .profile-section__description {
      font-size: 16px;
      line-height: 26px;
    }

    .profile-section__content {
      padding: 64px 20px;
    }

    .profile-section__card {
      padding: 34px 28px;
      border-radius: 20px;
    }

    .profile-section__card-heading {
      font-size: 31px;
      line-height: 36px;
    }

    .profile-section__quote p {
      font-size: 16px;
      line-height: 26px;
    }

    .profile-section__founders {
      justify-content: center;
      flex-wrap: wrap;
    }

    .profile-section__divider {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .profile-section {
      padding-top: 96px;
    }

    .profile-section__title {
      font-size: 42px;
      line-height: 44px;
    }

    .profile-section__card {
      padding: 28px 22px;
    }

    .profile-section__founders {
      flex-direction: column;
      align-items: center;
      gap: 28px;
    }
  }
`;

const ProfileSection = () => {
  return (
    <>
      <style data-component="tentang-profile-section">{profileSectionStyles}</style>

      <section id="profil-sejarah" className="profile-section" aria-labelledby="profile-title">
        <div className="profile-section__hero">
          <p className="profile-section__eyebrow">Tentang Kami</p>

          <h1 className="profile-section__title" id="profile-title">
            Profil &amp; Sejarah Kami
          </h1>

          <p className="profile-section__description">
            Membangun ruang kreatif, bisnis, digital, dan sosial yang mampu
            memberikan manfaat nyata bagi masyarakat Indonesia di era modern.
          </p>
        </div>

        <div className="profile-section__content">
          <div className="profile-section__card">
            <div className="profile-section__card-left">
              <p className="profile-section__eyebrow">Sejarah Kami</p>

              <h2 className="profile-section__card-heading">
                Bermula dari Sebuah Riset dan Ide Perkembangan
              </h2>

              <blockquote className="profile-section__quote">
                <p>
                  &ldquo;Membangun ruang kreatif, bisnis, digital, dan sosial
                  yang mampu memberikan manfaat bagi masyarakat di era
                  modern.&rdquo;
                </p>
              </blockquote>
            </div>

            <div className="profile-section__card-right">
              <p className="profile-section__copy">
                Mahreen Indonesia bermula dari sebuah proses riset, pemikiran,
                dan pengembangan ide yang dirancang sejak tahun 2024 sebagai
                langkah awal dalam membangun ruang kreatif, bisnis, digital,
                dan sosial yang mampu memberikan manfaat bagi masyarakat di era
                modern. Berawal dari konsep sederhana yang dituangkan melalui
                berbagai perencanaan dan pengembangan, Mahreen Indonesia terus
                bertumbuh menjadi identitas yang menghadirkan karya, solusi,
                serta kontribusi nyata melalui berbagai bidang yang dijalankan.
              </p>

              <p className="profile-section__copy">
                Seiring perjalanan dan perkembangan yang dibangun secara
                bertahap, pada tahun 2026 Mahreen Indonesia resmi memiliki
                legalitas usaha melalui Nomor Induk Berusaha (NIB){" "}
                <strong>1203260152054</strong> serta Surat Pencatatan Hak
                Kekayaan Intelektual (HAKI) &ldquo;Mahreen Indonesia&rdquo;
                dengan nomor pencatatan <strong>001180040</strong> dan nomor
                permohonan EC002026042583 tertanggal 28 Maret 2026 atas nama
                pencipta Tania Restiani Fajar.
              </p>

              <p className="profile-section__copy">
                Dengan semangat inovasi, kreativitas, dan kebermanfaatan,
                Mahreen Indonesia terus berkembang sebagai perusahaan yang
                berkomitmen menghadirkan solusi, karya, dan kontribusi positif
                bagi masyarakat Indonesia.
              </p>

              <div
                className="profile-section__founders"
                aria-label="Pendiri dan pimpinan Mahreen Indonesia"
              >
                {founders.map((founder, index) => (
                  <Fragment key={founder.name}>
                    {index > 0 ? (
                      <span
                        className="profile-section__divider"
                        aria-hidden="true"
                      />
                    ) : null}

                    <article
                      className={`profile-section__founder ${founder.className}`}
                    >
                      <img width="96" height="96" decoding="async" loading="lazy"
                        className="profile-section__avatar"
                        src={founder.image}
                        alt=""
                        aria-hidden="true"
                      />

                      <div>
                        <p className="profile-section__founder-name">
                          {founder.name}
                        </p>
                        <p className="profile-section__founder-role">
                          {founder.role}
                        </p>
                        <p className="profile-section__founder-company">
                          {founder.company}
                        </p>
                      </div>
                    </article>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfileSection;