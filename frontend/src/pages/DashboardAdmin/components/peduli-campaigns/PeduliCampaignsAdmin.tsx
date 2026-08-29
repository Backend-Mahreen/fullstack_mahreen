import { Plus, Search, Sparkles } from "lucide-react";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import {
  campaignRepository,
  type CampaignDefinition,
  type CampaignRecord,
  type CampaignSnapshot,
  type NewCampaignInput,
} from "../../../../services/campaign/campaignRepository";
import CampaignCard from "./CampaignCard";
import CampaignDetailDialog from "./CampaignDetailDialog";
import CampaignFilters, {
  type CampaignFilter,
  type CampaignViewMode,
} from "./CampaignFilters";
import CampaignMetrics from "./CampaignMetrics";

const AddCampaignWorkspace = lazy(() => import("./AddCampaignWorkspace"));

type PeduliCampaignsAdminProps = {
  query: string;
  onLocalAction: (message: string) => void;
};

const PEDULI_CAMPAIGN_STYLES = `
  .pcm-admin {
    --pcm-gold: #e7c77c;
    --pcm-gold-bright: #f1d28a;
    --pcm-panel: #101110;
    --pcm-panel-raised: #141514;
    --pcm-border: rgba(255,255,255,.085);
    --pcm-gold-border: rgba(231,199,124,.27);
    position: relative;
    width: 100%;
    min-height: calc(100vh - 110px);
    padding: 1px 0 48px;
    color: #eeeae3;
  }
  .pcm-admin::before {
    position: fixed;
    z-index: -1;
    top: 75px;
    right: 3%;
    width: 460px;
    height: 460px;
    border-radius: 50%;
    content: "";
    background: rgba(231,199,124,.04);
    filter: blur(105px);
    pointer-events: none;
  }
  .pcm-reveal {
    opacity: 0;
    transform: translate3d(0,20px,0) scale(.99);
    animation: pcm-reveal 680ms var(--pcm-delay,0ms) cubic-bezier(.22,1,.36,1) both;
  }
  .pcm-heading {
    display: flex;
    min-height: 106px;
    margin-bottom: 30px;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
  }
  .pcm-heading h1 {
    margin: 0;
    color: #f3efe8;
    font-size: clamp(34px,3.45vw,50px);
    font-weight: 620;
    line-height: 1.03;
    letter-spacing: -.048em;
  }
  .pcm-heading p { max-width:640px;margin:10px 0 0;color:#918c83;font-size:14px;line-height:1.6; }
  .pcm-heading__add {
    position: relative;
    display: inline-flex;
    min-width: 205px;
    min-height: 58px;
    padding: 14px 27px;
    align-items: center;
    justify-content: center;
    gap: 11px;
    overflow: hidden;
    border: 1px solid #edce86;
    border-radius: 999px;
    color: #1c1608;
    background: linear-gradient(135deg,#f1d38f,#dfb966);
    box-shadow: 0 15px 34px rgba(231,199,124,.17),0 0 28px rgba(231,199,124,.075);
    cursor: pointer;
    font-size: 14px;
    font-weight: 720;
    transition: transform 240ms cubic-bezier(.22,1,.36,1),box-shadow 240ms ease,filter 240ms ease;
  }
  .pcm-heading__add::after {
    position:absolute;top:-70%;left:-35%;width:24%;height:240%;content:"";background:linear-gradient(90deg,transparent,rgba(255,255,255,.42),transparent);transform:rotate(17deg);transition:left 580ms ease;
  }
  .pcm-heading__add:hover { transform:translateY(-4px) scale(1.012);box-shadow:0 19px 42px rgba(231,199,124,.25),0 0 36px rgba(231,199,124,.12);filter:brightness(1.05); }
  .pcm-heading__add:hover::after { left:120%; }
  .pcm-heading__add svg { width:18px;height:18px; }
  .pcm-metrics { display:grid;margin-bottom:48px;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px; }
  .pcm-metric {
    position: relative;
    isolation: isolate;
    min-height: 164px;
    padding: 24px 24px 21px;
    overflow: hidden;
    border: 1px solid var(--pcm-border);
    border-radius: 9px;
    background: radial-gradient(circle at 96% 4%,rgba(231,199,124,.06),transparent 35%),linear-gradient(145deg,rgba(255,255,255,.015),transparent 60%),var(--pcm-panel);
    box-shadow: 0 20px 52px rgba(0,0,0,.17);
    transition: transform 260ms cubic-bezier(.22,1,.36,1),border-color 260ms ease,box-shadow 260ms ease;
  }
  .pcm-metric::after { position:absolute;right:0;bottom:0;left:0;height:2px;content:"";background:linear-gradient(90deg,var(--pcm-gold),transparent);opacity:0;transform:scaleX(.3);transform-origin:left;transition:opacity 260ms ease,transform 460ms cubic-bezier(.22,1,.36,1); }
  .pcm-metric:hover { border-color:var(--pcm-gold-border);box-shadow:0 24px 60px rgba(0,0,0,.26),0 0 30px rgba(231,199,124,.055);transform:translateY(-5px); }
  .pcm-metric:hover::after { opacity:1;transform:scaleX(1); }
  .pcm-metric > div { display:flex;min-height:25px;align-items:center;justify-content:space-between;gap:12px;color:var(--pcm-gold); }
  .pcm-metric > div svg { width:20px;height:20px;filter:drop-shadow(0 0 8px rgba(231,199,124,.2)); }
  .pcm-metric > div span { padding:4px 7px;border-radius:3px;color:var(--pcm-gold);background:rgba(231,199,124,.09);font:700 14px ui-monospace,SFMono-Regular,Menlo,monospace;text-transform:uppercase; }
  .pcm-metric > small { display:block;margin-top:18px;color:#aaa49a;font:700 14px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.12em;text-transform:uppercase; }
  .pcm-metric > strong { display:block;margin-top:7px;color:#f0ede7;font-size:clamp(24px,2.3vw,34px);font-weight:540;line-height:1;letter-spacing:-.035em; }
  .pcm-metric > p { margin:9px 0 0;color:#716d66;font:600 14px ui-monospace,SFMono-Regular,Menlo,monospace; }
  .pcm-toolbar { display:flex;min-height:58px;margin-bottom:28px;align-items:flex-end;justify-content:space-between;gap:24px;border-bottom:1px solid rgba(255,255,255,.055); }
  .pcm-tabs { display:flex;min-width:0;align-items:end;gap:30px;overflow-x:auto;scrollbar-width:none; }
  .pcm-tabs::-webkit-scrollbar { display:none; }
  .pcm-tabs button { position:relative;min-height:47px;padding:0 0 15px;border:0;color:#8d887f;background:transparent;cursor:pointer;font-size:14px;white-space:nowrap;transition:color 190ms ease; }
  .pcm-tabs button::after { position:absolute;right:0;bottom:-1px;left:0;height:2px;content:"";background:var(--pcm-gold);opacity:0;transform:scaleX(.35);transition:opacity 200ms ease,transform 300ms cubic-bezier(.22,1,.36,1); }
  .pcm-tabs button:hover,.pcm-tabs button.is-active { color:var(--pcm-gold-bright); }
  .pcm-tabs button.is-active::after { opacity:1;transform:scaleX(1);box-shadow:0 0 12px rgba(231,199,124,.28); }
  .pcm-view-switch { display:flex;padding-bottom:11px;gap:5px; }
  .pcm-view-switch button { display:grid;width:36px;height:36px;place-items:center;border:1px solid transparent;border-radius:5px;color:#77736b;background:transparent;cursor:pointer;transition:color 180ms ease,border-color 180ms ease,background 180ms ease,box-shadow 180ms ease; }
  .pcm-view-switch button.is-active { color:var(--pcm-gold);border-color:var(--pcm-gold-border);background:rgba(231,199,124,.06);box-shadow:0 0 18px rgba(231,199,124,.04); }
  .pcm-view-switch svg { width:16px;height:16px; }
  .pcm-campaign-grid { display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px; }
  .pcm-campaign-grid.is-list { grid-template-columns:1fr 1fr; }
  .pcm-campaign-grid.is-list .pcm-campaign-card { display:grid;grid-template-columns:minmax(230px,.8fr) 1.2fr;min-height:310px; }
  .pcm-campaign-grid.is-list .pcm-campaign-card__image { min-height:100%;height:100%; }
  .pcm-campaign-card {
    position: relative;
    min-width: 0;
    overflow: hidden;
    border: 1px solid var(--pcm-border);
    border-radius: 12px;
    background: linear-gradient(145deg,rgba(255,255,255,.012),transparent 55%),var(--pcm-panel);
    box-shadow: 0 24px 64px rgba(0,0,0,.2);
    transition: transform 300ms cubic-bezier(.22,1,.36,1),border-color 260ms ease,box-shadow 260ms ease;
  }
  .pcm-campaign-card:hover { border-color:rgba(231,199,124,.26);box-shadow:0 30px 72px rgba(0,0,0,.31),0 0 36px rgba(231,199,124,.055);transform:translateY(-7px); }
  .pcm-campaign-card__image { position:relative;display:block;width:100%;height:225px;padding:0;overflow:hidden;border:0;background:#1a1b19;cursor:pointer; }
  .pcm-campaign-card__image::after { position:absolute;inset:0;content:"";background:linear-gradient(180deg,rgba(0,0,0,.05),transparent 52%,rgba(0,0,0,.45));pointer-events:none; }
  .pcm-campaign-card__image img { width:100%;height:100%;object-fit:cover;filter:saturate(.92) contrast(1.03);transition:transform 650ms cubic-bezier(.22,1,.36,1),filter 360ms ease; }
  .pcm-campaign-card:hover .pcm-campaign-card__image img { transform:scale(1.055);filter:saturate(1.05) contrast(1.04); }
  .pcm-campaign-card__placeholder { display:block;width:100%;height:100%;background:radial-gradient(circle at 35% 25%,rgba(231,199,124,.15),transparent 25%),linear-gradient(135deg,#25271f,#0d0e0d); }
  .pcm-campaign-card__category,.pcm-campaign-card__urgent,.pcm-campaign-card__draft { position:absolute;z-index:1;top:13px;left:13px;padding:5px 9px;border:1px solid rgba(231,199,124,.34);border-radius:99px;color:#f0dca7;background:rgba(24,23,17,.78);backdrop-filter:blur(8px);font:700 14px ui-monospace,SFMono-Regular,Menlo,monospace;text-transform:uppercase; }
  .pcm-campaign-card__urgent { right:13px;left:auto;color:#5b160f;border-color:#f0a8a0;background:#f2aaa3; }
  .pcm-campaign-card__draft { top:auto;right:13px;bottom:13px;left:auto;color:#161207;background:var(--pcm-gold); }
  .pcm-campaign-card__body { padding:23px 21px 21px; }
  .pcm-campaign-card__location { display:flex;margin-bottom:8px;align-items:center;gap:5px;color:#746f67;font-size:14px; }
  .pcm-campaign-card__location svg { width:11px;height:11px;color:var(--pcm-gold); }
  .pcm-campaign-card h2 { min-height:50px;margin:0;color:#ece8e1;font-size:17px;font-weight:560;line-height:1.42;letter-spacing:-.02em; }
  .pcm-campaign-card__body > p { display:-webkit-box;min-height:46px;margin:8px 0 19px;overflow:hidden;color:#8d887f;font-size:14px;line-height:1.6;-webkit-box-orient:vertical;-webkit-line-clamp:3; }
  .pcm-campaign-card__amount { display:flex;align-items:center;justify-content:space-between;gap:10px;color:#d0c9bf;font-size:14px; }
  .pcm-campaign-card__amount strong { color:var(--pcm-gold-bright);font-size:14px; }
  .pcm-progress { height:5px;margin-top:9px;overflow:hidden;border-radius:99px;background:#292a27; }
  .pcm-progress i { display:block;min-width:2px;height:100%;border-radius:inherit;background:linear-gradient(90deg,#c9a653,#f0d18a);box-shadow:0 0 12px rgba(231,199,124,.22);transition:width 550ms cubic-bezier(.22,1,.36,1); }
  .pcm-campaign-card__target { display:flex;margin-top:11px;align-items:flex-start;justify-content:space-between;gap:12px;color:#706c64;font:600 14px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace;text-transform:uppercase; }
  .pcm-campaign-card__target span:last-child { text-align:right; }
  .pcm-campaign-card footer { display:grid;margin-top:20px;padding-top:17px;grid-template-columns:31px 1fr auto;align-items:center;gap:9px;border-top:1px solid rgba(255,255,255,.055); }
  .pcm-pic-avatar { display:grid;width:31px;height:31px;place-items:center;border:1px solid rgba(231,199,124,.2);border-radius:50%;color:#1a1508;background:linear-gradient(135deg,#f0d18a,#967639);font-weight:760;box-shadow:0 0 14px rgba(231,199,124,.08); }
  .pcm-campaign-card footer > span:nth-child(2) { display:grid;gap:2px;min-width:0; }
  .pcm-campaign-card footer small { color:#69655e;font:600 14px ui-monospace,SFMono-Regular,Menlo,monospace;text-transform:uppercase; }
  .pcm-campaign-card footer strong { overflow:hidden;color:#c5bfb6;font-size:14px;font-weight:560;text-overflow:ellipsis;white-space:nowrap; }
  .pcm-campaign-card footer button { display:flex;align-items:center;gap:4px;border:0;color:var(--pcm-gold);background:transparent;cursor:pointer;font:700 14px ui-monospace,SFMono-Regular,Menlo,monospace;text-transform:uppercase; }
  .pcm-campaign-card footer button svg { width:12px;height:12px;transition:transform 190ms ease; }
  .pcm-campaign-card footer button:hover svg { transform:translate(2px,-2px); }
  .pcm-empty { display:grid;min-height:310px;padding:32px;place-items:center;align-content:center;gap:12px;border:1px dashed var(--pcm-gold-border);border-radius:12px;color:#77726a;background:rgba(255,255,255,.01);text-align:center; }
  .pcm-empty svg { width:28px;height:28px;color:var(--pcm-gold); }
  .pcm-empty h2 { margin:0;color:#d4cec5;font-size:18px; }
  .pcm-empty p { margin:0;font-size:14px; }
  .pcm-loading { display:grid;min-height:55vh;place-items:center;color:var(--pcm-gold);font:700 14px ui-monospace,SFMono-Regular,Menlo,monospace;text-transform:uppercase; }
  .pcm-dialog-backdrop { position:fixed;z-index:300;inset:0;display:grid;padding:24px;place-items:center;background:rgba(0,0,0,.82);backdrop-filter:blur(10px);animation:pcm-fade 220ms ease both; }
  .pcm-dialog { position:relative;width:min(760px,100%);overflow:hidden;border:1px solid var(--pcm-gold-border);border-radius:14px;background:#121312;box-shadow:0 36px 105px rgba(0,0,0,.76),0 0 44px rgba(231,199,124,.08);animation:pcm-dialog-enter 430ms cubic-bezier(.22,1,.36,1) both; }
  .pcm-dialog__close { position:absolute;z-index:3;top:15px;right:15px;display:grid;width:39px;height:39px;place-items:center;border:1px solid rgba(255,255,255,.14);border-radius:50%;color:#e9e4dc;background:rgba(0,0,0,.62);cursor:pointer; }
  .pcm-dialog__close svg { width:17px; }
  .pcm-dialog__cover { position:relative;height:270px;background:linear-gradient(135deg,#28291f,#0d0e0d); }
  .pcm-dialog__cover::after { position:absolute;inset:0;content:"";background:linear-gradient(180deg,transparent 45%,rgba(0,0,0,.64)); }
  .pcm-dialog__cover img { width:100%;height:100%;object-fit:cover; }
  .pcm-dialog__cover span { position:absolute;z-index:1;bottom:18px;left:24px;padding:6px 10px;border:1px solid rgba(231,199,124,.35);border-radius:99px;color:var(--pcm-gold-bright);background:rgba(12,12,10,.65);font:700 14px ui-monospace,SFMono-Regular,Menlo,monospace;text-transform:uppercase; }
  .pcm-dialog__content { padding:29px 30px 30px; }
  .pcm-dialog__content > small { color:var(--pcm-gold);font:700 14px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.1em; }
  .pcm-dialog h2 { margin:7px 0 9px;color:#f0ede7;font-size:28px;line-height:1.15;letter-spacing:-.035em; }
  .pcm-dialog__content > p { margin:0;color:#969188;font-size:14px;line-height:1.7; }
  .pcm-dialog__facts { display:flex;margin:20px 0;flex-wrap:wrap;gap:10px 20px;color:#8c877e;font-size:14px; }
  .pcm-dialog__facts span { display:flex;align-items:center;gap:7px; }
  .pcm-dialog__facts svg { width:14px;height:14px;color:var(--pcm-gold); }
  .pcm-dialog__funding { display:grid;margin-top:20px;grid-template-columns:1fr 1fr auto;align-items:end;gap:20px; }
  .pcm-dialog__funding span { display:grid;gap:4px; }
  .pcm-dialog__funding small { color:#6f6b64;font:600 14px ui-monospace,SFMono-Regular,Menlo,monospace;text-transform:uppercase; }
  .pcm-dialog__funding strong { color:#ddd8d0;font-size:14px; }
  .pcm-dialog__funding b { color:var(--pcm-gold);font-size:20px; }
  .pcm-dialog__actions { display:flex;margin-top:25px;justify-content:flex-end;gap:11px; }
  .pcm-dialog__actions button { display:flex;min-height:42px;padding:9px 17px;align-items:center;justify-content:center;gap:8px;border:1px solid rgba(255,255,255,.1);border-radius:5px;color:#bd7972;background:transparent;cursor:pointer;font-size:14px;font-weight:700; }
  .pcm-dialog__actions button:last-child { color:#1b1608;border-color:var(--pcm-gold);background:linear-gradient(135deg,#efd18a,#ddb762);box-shadow:0 11px 26px rgba(231,199,124,.12); }
  .pcm-dialog__actions svg { width:14px;height:14px; }
  @keyframes pcm-reveal { from { opacity:0;transform:translate3d(0,20px,0) scale(.99); } to { opacity:1;transform:none; } }
  @keyframes pcm-fade { from { opacity:0; } to { opacity:1; } }
  @keyframes pcm-dialog-enter { from { opacity:0;transform:translateY(20px) scale(.97); } to { opacity:1;transform:none; } }
  @media (max-width:1320px) { .pcm-campaign-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.pcm-campaign-card__image{height:250px} }
  @media (max-width:1040px) { .pcm-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.pcm-campaign-grid.is-list{grid-template-columns:1fr}.pcm-campaign-grid.is-list .pcm-campaign-card{grid-template-columns:260px 1fr} }
  @media (max-width:720px) { .pcm-heading{align-items:flex-start;flex-direction:column}.pcm-heading__add{width:100%}.pcm-metrics{grid-template-columns:1fr;gap:14px}.pcm-toolbar{align-items:stretch;flex-direction:column}.pcm-tabs{gap:22px}.pcm-view-switch{align-self:flex-end}.pcm-campaign-grid,.pcm-campaign-grid.is-list{grid-template-columns:1fr}.pcm-campaign-grid.is-list .pcm-campaign-card{display:block}.pcm-campaign-card__image{height:230px}.pcm-dialog__cover{height:220px}.pcm-dialog__content{padding:24px 20px}.pcm-dialog__funding{grid-template-columns:1fr 1fr}.pcm-dialog__funding b{grid-column:1/-1}.pcm-dialog__actions{flex-direction:column}.pcm-dialog__actions button{width:100%} }
  @media (prefers-reduced-motion:reduce) { .pcm-reveal,.pcm-dialog-backdrop,.pcm-dialog{opacity:1;transform:none;animation:none}.pcm-admin *,.pcm-admin *::before,.pcm-admin *::after{transition-duration:.01ms!important} }
`;

const PeduliCampaignsAdmin = ({ query, onLocalAction }: PeduliCampaignsAdminProps) => {
  const [snapshot, setSnapshot] = useState<CampaignSnapshot>(() =>
    campaignRepository.getSnapshot(),
  );
  const [filter, setFilter] = useState<CampaignFilter>("All Campaigns");
  const [viewMode, setViewMode] = useState<CampaignViewMode>("grid");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignDefinition | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignRecord | null>(null);

  useEffect(() => {
    const refresh = () => setSnapshot(campaignRepository.getSnapshot());
    const unsubscribe = campaignRepository.subscribe(refresh);
    window.addEventListener("focus", refresh);
    return () => {
      unsubscribe();
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const filteredCampaigns = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return snapshot.campaigns.filter((campaign) => {
      const matchesFilter = filter === "All Campaigns" || campaign.category === filter;
      const matchesQuery =
        !normalizedQuery ||
        [campaign.title, campaign.location, campaign.pic, campaign.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query, snapshot.campaigns]);

  const openCreate = () => {
    setEditingCampaign(null);
    setSelectedCampaign(null);
    setEditorOpen(true);
  };

  const openEdit = (campaign: CampaignDefinition) => {
    setEditingCampaign(campaign);
    setSelectedCampaign(null);
    setEditorOpen(true);
  };

  const saveCampaign = (input: NewCampaignInput, existingId?: string) => {
    const saved = campaignRepository.saveCampaign(input, existingId);
    setSnapshot(campaignRepository.getSnapshot());
    return saved;
  };

  const deleteCampaign = (id: string) => {
    setSnapshot(campaignRepository.deleteCampaign(id));
    setSelectedCampaign(null);
  };

  if (editorOpen) {
    return (
      <Suspense fallback={<div className="pcm-loading">Membuka campaign workspace...</div>}>
        <AddCampaignWorkspace
          campaign={editingCampaign}
          key={editingCampaign?.id ?? "new-campaign"}
          onClose={() => setEditorOpen(false)}
          onDelete={deleteCampaign}
          onNotify={onLocalAction}
          onSave={saveCampaign}
        />
      </Suspense>
    );
  }

  return (
    <div className="pcm-admin">
      <style>{PEDULI_CAMPAIGN_STYLES}</style>
      <header className="pcm-heading pcm-reveal">
        <div>
          <h1>Active Campaigns</h1>
          <p>Monitor and manage charitable initiatives. Real-time local data sync for transparent impact tracking across the Peduli Mahreen ecosystem.</p>
        </div>
        <button className="pcm-heading__add" onClick={openCreate} type="button">
          <Plus aria-hidden="true" /> Tambah Campaign
        </button>
      </header>

      <CampaignMetrics metrics={snapshot.metrics} />
      <CampaignFilters
        active={filter}
        mode={viewMode}
        onChange={setFilter}
        onModeChange={setViewMode}
      />

      {filteredCampaigns.length ? (
        <section className={`pcm-campaign-grid${viewMode === "list" ? " is-list" : ""}`} aria-label="Daftar campaign">
          {filteredCampaigns.map((campaign, index) => (
            <CampaignCard
              campaign={campaign}
              index={index}
              key={campaign.id}
              onOpen={setSelectedCampaign}
            />
          ))}
        </section>
      ) : (
        <section className="pcm-empty pcm-reveal">
          {query ? <Search aria-hidden="true" /> : <Sparkles aria-hidden="true" />}
          <h2>Campaign tidak ditemukan</h2>
          <p>Ubah filter atau buat campaign baru untuk menyimpan data ke database lokal.</p>
        </section>
      )}

      {selectedCampaign ? (
        <CampaignDetailDialog
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onDelete={(campaign) => {
            if (!window.confirm(`Hapus campaign ${campaign.title} dari database?`)) return;
            deleteCampaign(campaign.id);
            onLocalAction(`${campaign.title} dihapus dari database lokal.`);
          }}
          onEdit={openEdit}
        />
      ) : null}
    </div>
  );
};

export default PeduliCampaignsAdmin;
