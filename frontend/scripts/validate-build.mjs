import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { getSiteUrl } from "./site-origin.mjs";

const projectRoot = new URL("../", import.meta.url);
const distRoot = new URL("../dist/", import.meta.url);
const sourceRoot = new URL("../src/", import.meta.url);
const siteUrl = getSiteUrl();
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const walk = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const url = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directory);
      return entry.isDirectory() ? walk(url) : [url];
    }),
  );
  return files.flat();
};

const seoFiles = await readdir(new URL("seo/", distRoot));
assert.equal(seoFiles.length, 17, "Expected 17 route-specific SEO documents");
const seoFileSet = new Set(seoFiles);
const indexHtml = await readFile(new URL("index.html", distRoot), "utf8");
const distFiles = await walk(distRoot);
const distFileSet = new Set(
  distFiles.map((url) => decodeURIComponent(url.pathname.slice(distRoot.pathname.length))),
);

assert.match(
  indexHtml,
  /<style data-entry-css>/,
  "Entry CSS must be inlined to avoid a render-blocking stylesheet request",
);
assert.doesNotMatch(
  indexHtml,
  /<link[^>]+rel="stylesheet"[^>]+href="\/assets\/index-[^"]+\.css"/,
  "Entry CSS is still requested as a render-blocking stylesheet",
);
assert.doesNotMatch(
  indexHtml,
  /<link[^>]+rel="modulepreload"[^>]+href="\/assets\/seo-[^"]+\.js"/,
  "SEO chunk must not be preloaded on the initial homepage request",
);
assert.doesNotMatch(
  indexHtml,
  /<link[^>]+rel="modulepreload"[^>]+href="\/assets\/HomeSections-[^"]+\.js"/,
  "Below-the-fold homepage code must not be preloaded before interaction",
);
assert.doesNotMatch(
  indexHtml,
  /<link[^>]+rel="modulepreload"[^>]+href="\/assets\/DeferredNewsroomSections-[^"]+\.js"/,
  "Deferred Newsroom code must not be preloaded before interaction",
);
assert.doesNotMatch(
  indexHtml,
  /<link[^>]+rel="modulepreload"[^>]+href="\/assets\/DeferredAppRoutes-[^"]+\.js"/,
  "The complete route registry must not be preloaded on the initial homepage request",
);
assert.match(
  indexHtml,
  /mahreen-logo-192\.webp 192w, \/mahreen-logo-384\.webp 384w/,
  "Responsive navbar logo preload is missing",
);
assert.doesNotMatch(
  indexHtml,
  /<link[^>]+rel="preconnect"[^>]+href="https:\/\/fonts\.(?:googleapis|gstatic)\.com"/,
  "Google Fonts must not be connected during the first mobile render",
);
assert.doesNotMatch(
  indexHtml,
  /<link[^>]+id="mahreen-font-styles"[^>]+rel="preload"/,
  "Google Fonts stylesheet must not be preloaded on the initial request",
);
assert.match(
  indexHtml,
  /id="mahreen-font-styles"[\s\S]*?media="not all"[\s\S]*?data-href="https:\/\/fonts\.googleapis\.com\/css2/,
  "Interaction-deferred Google Fonts link is missing",
);
assert.match(indexHtml, /<meta property="og:locale" content="id_ID"\s*\/?>/);
assert.match(indexHtml, /<meta property="og:image:width" content="1200"\s*\/?>/);
assert.match(indexHtml, /<meta property="og:image:height" content="630"\s*\/?>/);
assert.match(indexHtml, /<meta property="og:image:alt" content="[^"]+"\s*\/?>/);
assert.match(indexHtml, /<meta name="twitter:image:alt" content="[^"]+"\s*\/?>/);
assert.match(indexHtml, /<script type="application\/ld\+json" data-route-seo>/);
assert.match(
  indexHtml,
  new RegExp(`<link rel="canonical" href="${escapeRegex(siteUrl)}\/"\\s*\/?>`),
  "Homepage canonical does not match the configured deployment origin",
);

// Validasi SEO files existence
for (const filename of seoFiles) {
  const html = await readFile(new URL(`seo/${filename}`, distRoot), "utf8");
  assert.match(
    html,
    new RegExp(`<link rel="canonical" href="${escapeRegex(siteUrl)}\/`),
  );
  assert.doesNotMatch(
    html,
    new RegExp(`<link rel="canonical" href="${escapeRegex(siteUrl)}\/"\\s*\/>`),
    `${filename} still uses the homepage canonical`,
  );
  assert.match(html, /<meta property="og:url" content="https:\/\/[^"/]+\/.+"\s*\/?>/);
  assert.equal(
    (html.match(/data-route-seo/g) ?? []).length,
    1,
    `${filename} must contain exactly one route-specific JSON-LD block`,
  );
}

const sourceFiles = (await walk(sourceRoot)).filter((url) =>
  /\.(?:ts|tsx|js|jsx)$/.test(url.pathname),
);
const source = (
  await Promise.all(sourceFiles.map((url) => readFile(url, "utf8")))
).join("\n");

const homeSource = await readFile(
  new URL("pages/Home/Home.tsx", sourceRoot),
  "utf8",
);

assert.doesNotMatch(
  homeSource,
  /setTimeout\s*\([^)]*showBelowFold|setTimeout\s*\([^)]*revealBelowFold/s,
  "Homepage below-the-fold content must not auto-load on a timer",
);

const newsroomHomeSource = await readFile(
  new URL("pages/Newsroom/Home/Home.tsx", sourceRoot),
  "utf8",
);
assert.match(
  newsroomHomeSource,
  /import DeferredNewsroomSections from ["']\.\/DeferredNewsroomSections["']/,
  "Newsroom sections must be part of the Newsroom route chunk so content cannot remain blank",
);
assert.doesNotMatch(
  newsroomHomeSource,
  /showDeferredSections|deferredSentinelRef|IntersectionObserver/,
  "Newsroom content visibility must not depend on interaction or an observer",
);

const clientNewsroomSource = await readFile(
  new URL("pages/DashboardClient/components/NewsroomSection.tsx", sourceRoot),
  "utf8",
);
assert.match(
  clientNewsroomSource,
  /\.slice\(0,\s*3\)/,
  "Client dashboard must show exactly the three newest Newsroom articles",
);
assert.match(
  clientNewsroomSource,
  /actionHref=["']\/newsroom\/berita\?view=all["']/,
  "Client dashboard View All action must request the complete Newsroom list",
);

const newsroomListSource = await readFile(
  new URL("pages/Newsroom/Berita/Berita.tsx", sourceRoot),
  "utf8",
);
assert.match(
  newsroomListSource,
  /searchParams\.get\(["']view["']\)\s*===\s*["']all["']/,
  "Newsroom list must honor the complete-list view parameter",
);

const dashboardLocalSource = await readFile(
  new URL("pages/DashboardClient/dashboardLocalData.ts", sourceRoot),
  "utf8",
);
assert.doesNotMatch(
  dashboardLocalSource,
  /projectSeeds|createScheduleSeeds|Ecosystem Redesign|FinTech Dashboard/,
  "Client dashboard must not inject dummy project or schedule seeds",
);
assert.match(
  dashboardLocalSource,
  /dashboardRepository\.synchronize/,
  "Client dashboard must synchronize projects and schedules through its repository",
);

const upcomingScheduleSource = await readFile(
  new URL("pages/DashboardClient/components/UpcomingSchedule.tsx", sourceRoot),
  "utf8",
);
assert.match(
  upcomingScheduleSource,
  /title=["']Upcoming Schedule["']/,
  "Upcoming Schedule heading must match the approved dashboard design",
);
assert.match(
  upcomingScheduleSource,
  /Belum ada jadwal mendatang/,
  "Upcoming Schedule must use a real empty state instead of dummy cards",
);

const adminDashboardSource = await readFile(
  new URL("pages/DashboardAdmin/AdminDashboard.tsx", sourceRoot),
  "utf8",
);
assert.match(
  adminDashboardSource,
  /activeModule === ["']tanya-mahreen["'][\s\S]*?<ServiceManagementAdmin/,
  "Tanya Mahreen admin menu must render the dedicated Service Management page",
);
assert.match(
  adminDashboardSource,
  /activeModule === ["']peduli-mahreen["'][\s\S]*?<PeduliCampaignsAdmin/,
  "Peduli Mahreen admin menu must render the dedicated campaign page",
);

const serviceManagementSource = await readFile(
  new URL(
    "pages/DashboardAdmin/components/service-management/ServiceManagementAdmin.tsx",
    sourceRoot,
  ),
  "utf8",
);
assert.match(serviceManagementSource, /serviceManagementRepository\.getSnapshot/);
assert.match(serviceManagementSource, />Service Management</);
assert.match(serviceManagementSource, /sm-admin-reveal/);
assert.match(
  serviceManagementSource,
  /<BulkAssignmentWorkspace/,
  "Bulk Assign PM must open the dedicated assignment workspace",
);
assert.match(
  serviceManagementSource,
  /<AddServiceWorkspace/,
  "Tambah Service must open the dedicated Add New Service workspace",
);

const addServiceSource = await readFile(
  new URL(
    "pages/DashboardAdmin/components/service-management/AddServiceWorkspace.tsx",
    sourceRoot,
  ),
  "utf8",
);
assert.match(addServiceSource, />Add New Service</);
assert.match(addServiceSource, /<ServiceBasicInformation/);
assert.match(addServiceSource, /<ServicePricingDetails/);
assert.match(addServiceSource, /<ServiceMediaAssets/);
assert.match(addServiceSource, /<ServiceSeoConfiguration/);
assert.match(addServiceSource, /<ServicePublishingPanel/);
assert.match(addServiceSource, /ans-reveal/);

const serviceMediaSource = await readFile(
  new URL(
    "pages/DashboardAdmin/components/service-management/ServiceMediaAssets.tsx",
    sourceRoot,
  ),
  "utf8",
);
assert.match(
  serviceMediaSource,
  /multiple/,
  "Service gallery upload must support selecting multiple images",
);
assert.match(serviceMediaSource, /Promise\.allSettled/);

const bulkAssignmentSource = await readFile(
  new URL(
    "pages/DashboardAdmin/components/service-management/BulkAssignmentWorkspace.tsx",
    sourceRoot,
  ),
  "utf8",
);
assert.match(bulkAssignmentSource, />Assign Project Managers</);
assert.match(bulkAssignmentSource, />Requests Selected</);
assert.match(bulkAssignmentSource, />Confirm Assignment/);
assert.match(bulkAssignmentSource, /ba-enter/);

const serviceManagementRepositorySource = await readFile(
  new URL("services/serviceManagement/serviceManagementRepository.ts", sourceRoot),
  "utf8",
);
assert.match(
  serviceManagementRepositorySource,
  /readLocalConsultationRequests/,
  "Service Management must aggregate real local consultation requests",
);
assert.match(
  serviceManagementRepositorySource,
  /DASHBOARD_PROJECTS_STORAGE_PREFIX[\s\S]*DASHBOARD_SCHEDULE_STORAGE_PREFIX/,
  "Service Management must aggregate scoped local projects and schedules",
);
assert.match(
  serviceManagementRepositorySource,
  /saveBulkAssignmentDraft[\s\S]*confirmBulkAssignment/,
  "Bulk assignment draft and confirmation must be isolated in the local repository",
);
assert.doesNotMatch(
  serviceManagementRepositorySource,
  /Jonathan Dewanto|Ratna Kusuma|Aditya Bagaskara|Maya Lestari/,
  "Service Management repository must not contain screenshot dummy records",
);

const peduliCampaignSource = await readFile(
  new URL(
    "pages/DashboardAdmin/components/peduli-campaigns/PeduliCampaignsAdmin.tsx",
    sourceRoot,
  ),
  "utf8",
);
assert.match(peduliCampaignSource, />Active Campaigns</);
assert.match(peduliCampaignSource, /campaignRepository\.getSnapshot/);
assert.match(peduliCampaignSource, /<CampaignMetrics/);
assert.match(peduliCampaignSource, /<CampaignFilters/);
assert.match(peduliCampaignSource, /<CampaignCard/);
assert.match(peduliCampaignSource, /<AddCampaignWorkspace/);
assert.match(peduliCampaignSource, /pcm-reveal/);

const addCampaignSource = await readFile(
  new URL(
    "pages/DashboardAdmin/components/peduli-campaigns/AddCampaignWorkspace.tsx",
    sourceRoot,
  ),
  "utf8",
);
assert.match(addCampaignSource, /Tambah Campaign Baru/);
assert.match(addCampaignSource, /<CampaignBasicInformation/);
assert.match(addCampaignSource, /<CampaignTargetPeriod/);
assert.match(addCampaignSource, /<CampaignContentEditor/);
assert.match(addCampaignSource, /<CampaignMediaAssets/);
assert.match(addCampaignSource, /<CampaignPublishingPanel/);
assert.match(addCampaignSource, /acw-reveal/);

const campaignMediaSource = await readFile(
  new URL(
    "pages/DashboardAdmin/components/peduli-campaigns/CampaignMediaAssets.tsx",
    sourceRoot,
  ),
  "utf8",
);
assert.match(campaignMediaSource, /multiple/);
assert.match(campaignMediaSource, /Promise\.allSettled/);

const campaignRepositorySource = await readFile(
  new URL("services/campaign/campaignRepository.ts", sourceRoot),
  "utf8",
);
assert.match(campaignRepositorySource, /readDonationHistory/);
assert.match(campaignRepositorySource, /saveCampaign[\s\S]*deleteCampaign/);
assert.match(campaignRepositorySource, /CampaignRepository/);
assert.doesNotMatch(
  campaignRepositorySource,
  /1_284_000_000|12_402|280_000_000/,
  "Peduli Campaign metrics must not copy static values from the reference screenshot",
);

const distReferenceFiles = distFiles.filter((url) => /\.(?:html|js|css)$/.test(url.pathname));
const builtAssetReferencePattern = /\/assets\/[^"'`()\s?#]+\.(?:js|css|png|jpe?g|webp|avif|svg|woff2?)/g;

for (const file of distReferenceFiles) {
  const content = await readFile(file, "utf8");
  const references = content.match(builtAssetReferencePattern) ?? [];

  for (const reference of references) {
    const relativeReference = decodeURIComponent(reference.slice(1));
    assert.ok(
      distFileSet.has(relativeReference),
      `${decodeURIComponent(file.pathname.slice(distRoot.pathname.length))} references missing ${reference}`,
    );
  }
}

assert.doesNotMatch(
  source,
  /webinar-(?:uiux|digital|ai)[^"']*\.png/i,
  "Newsroom still references an unoptimized legacy webinar PNG",
);

assert.doesNotMatch(source, /href=["']https:\/\/wa\.me\/["']/);
assert.doesNotMatch(source, /\bcardNumber\b|\bcardholderName\b|\bcvc\b/i);

console.log("Build validation passed.");
