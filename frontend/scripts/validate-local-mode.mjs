import assert from "node:assert/strict";
import { createServer } from "vite";

class MemoryStorage {
  #values = new Map();

  get length() {
    return this.#values.size;
  }

  clear() {
    this.#values.clear();
  }

  getItem(key) {
    return this.#values.has(key) ? this.#values.get(key) : null;
  }

  key(index) {
    return [...this.#values.keys()][index] ?? null;
  }

  removeItem(key) {
    this.#values.delete(key);
  }

  setItem(key, value) {
    this.#values.set(String(key), String(value));
  }
}

const localStorage = new MemoryStorage();
const sessionStorage = new MemoryStorage();
globalThis.window = {
  localStorage,
  sessionStorage,
  dispatchEvent() {},
};

const server = await createServer({
  mode: "localmode",
  appType: "custom",
  server: { middlewareMode: true },
});

try {
  const { env } = await server.ssrLoadModule("/src/config/env.ts");
  assert.equal(env.dataSourceMode, "local");
  assert.equal(env.newsroomDataSourceMode, "local");
  assert.equal(env.enableTransactionUi, true);

  const { authService } = await server.ssrLoadModule(
    "/src/services/auth/authService.ts",
  );
  const { getLoginRedirectRoute, getPostLoginRoute } = await server.ssrLoadModule(
    "/src/services/auth/authNavigation.ts",
  );
  const {
    emptyRegistrationDraft,
    LOCAL_ADMIN_CREDENTIALS,
    LOCAL_DEMO_CREDENTIALS,
  } = await server.ssrLoadModule(
    "/src/services/auth/authConstants.ts",
  );

  const email = "local-test@mahreen.test";
  const password = "LocalTest123!";
  const user = await authService.register({
    ...emptyRegistrationDraft,
    accountType: "individual",
    fullName: "Local Storage Test",
    nickname: "Local",
    email,
    whatsapp: "+628000000000",
    password,
  });

  assert.equal(user.email, email);
  assert.equal(user.role, "client");
  assert.ok(localStorage.getItem("mahreen:auth:accounts"));

  const result = await authService.login({
    email,
    password,
    remember: true,
  });

  assert.equal(result.user.email, email);
  assert.equal(result.user.role, "client");
  assert.ok(localStorage.getItem("mahreen:auth:session"));
  assert.ok(localStorage.getItem("mahreen:auth:user"));

  const demoResult = await authService.login({
    ...LOCAL_DEMO_CREDENTIALS,
    remember: false,
  });
  assert.equal(demoResult.user.role, "client");
  assert.equal(getPostLoginRoute(demoResult.user.role, null), "/dashboard");
  assert.equal(getPostLoginRoute(demoResult.user.role, "/admin"), "/dashboard");
  assert.equal(getPostLoginRoute(demoResult.user.role, "/newsroom"), "/newsroom");
  assert.match(getLoginRedirectRoute("/admin"), /^\/admin\/login\?/);
  assert.match(getLoginRedirectRoute("/dashboard"), /^\/login\?/);

  const adminResult = await authService.login({
    ...LOCAL_ADMIN_CREDENTIALS,
    remember: false,
  });
  assert.equal(adminResult.user.role, "admin");
  assert.equal(adminResult.session.role, "admin");
  assert.equal(getPostLoginRoute(adminResult.user.role, null), "/admin");

  const { adminCredentialRecoveryService } = await server.ssrLoadModule(
    "/src/services/auth/adminCredentialRecoveryService.ts",
  );
  const adminRecoveryRequest = await adminCredentialRecoveryService.requestRecovery(
    "security-key",
    LOCAL_ADMIN_CREDENTIALS.email,
  );
  assert.equal(adminRecoveryRequest.selection, "security-key");
  assert.equal(adminRecoveryRequest.status, "pending-verification");
  assert.ok(localStorage.getItem("mahreen:admin:credential-recovery:v1"));

  await assert.rejects(
    authService.login({
      email: LOCAL_ADMIN_CREDENTIALS.email,
      password: "WrongAdminPassword!",
      remember: false,
    }),
  );

  await assert.rejects(
    authService.register({
      ...emptyRegistrationDraft,
      accountType: "individual",
      fullName: "Unauthorized Admin Registration",
      nickname: "Unauthorized",
      email: LOCAL_ADMIN_CREDENTIALS.email,
      whatsapp: "+628000000001",
      password: LOCAL_ADMIN_CREDENTIALS.password,
    }),
    /akun sistem/i,
  );

  const { newsroomService } = await server.ssrLoadModule(
    "/src/services/newsroom/newsroomService.ts",
  );
  const { isPublishedNewsroomArticle } = await server.ssrLoadModule(
    "/src/data/newsroomLocalDatabase.ts",
  );
  const newsroomArticle = {
    id: 9_999_001,
    slug: "artikel-sinkronisasi-local-test",
    title: "Artikel Sinkronisasi Local Test",
    detailTitle: "Artikel Sinkronisasi Local Test",
    excerpt: "Artikel pengujian sinkronisasi admin ke halaman pengguna.",
    category: "Technology",
    publishedAt: "02 Agu 2026",
    readTime: "1 Min Read",
    image: "/og-image.jpg",
    thumbnail: "/thumbnail.jpg",
    gallery: [
      { src: "/gallery-1.jpg", alt: "Gallery one" },
      { src: "/gallery-2.jpg", alt: "Gallery two" },
    ],
    author: "Admin Mahreen",
    publicationStatus: "Published",
    source: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    visibility: {
      showHomepage: true,
      featuredArticle: false,
      breakingNews: false,
    },
    content: {
      lead: "Artikel pengujian sinkronisasi admin ke halaman pengguna.",
      sections: [{ heading: "Isi Artikel", paragraphs: ["Konten pengujian."] }],
    },
  };

  await newsroomService.saveArticle(newsroomArticle);
  const newsroomSnapshot = newsroomService.getSnapshot();
  const savedNewsroomArticle = newsroomSnapshot.articles.find(
    (article) => article.slug === newsroomArticle.slug,
  );
  assert.ok(savedNewsroomArticle);
  assert.equal(isPublishedNewsroomArticle(savedNewsroomArticle), true);
  assert.equal(savedNewsroomArticle.gallery.length, 2);
  assert.ok(localStorage.getItem("mahreen.newsroom.database.v1"));

  await newsroomService.saveArticle({
    ...savedNewsroomArticle,
    title: "Artikel Sinkronisasi Local Test Updated",
    updatedAt: new Date().toISOString(),
  });
  assert.equal(
    newsroomService.getSnapshot().articles.filter(
      (article) => article.id === newsroomArticle.id,
    ).length,
    1,
  );
  assert.equal(
    newsroomService.getSnapshot().articles.find(
      (article) => article.id === newsroomArticle.id,
    ).title,
    "Artikel Sinkronisasi Local Test Updated",
  );

  await newsroomService.recordView(newsroomArticle.slug);
  await newsroomService.recordView(newsroomArticle.slug);
  assert.equal(
    newsroomService.getSnapshot().articles.find(
      (article) => article.slug === newsroomArticle.slug,
    ).viewCount,
    1,
  );

  await newsroomService.deleteArticle(newsroomArticle.slug);
  assert.equal(
    newsroomService.getSnapshot().articles.some(
      (article) => article.slug === newsroomArticle.slug,
    ),
    false,
  );

  const { localDashboardRepository } = await server.ssrLoadModule(
    "/src/services/dashboard/dashboardRepository.ts",
  );
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);
  const dashboardSnapshot = localDashboardRepository.synchronize("local-test-user", {
    projects: [
      {
        id: "service:local-test",
        title: "Local Service Project",
        description: "Project created from a local user transaction.",
        progress: 35,
        status: "Kickoff Ready",
        clientName: "Local Storage Test",
        company: "Mahreen Local QA",
        serviceCategory: "Strategic Brand Audit",
        budget: 2_500_000,
        revenue: 1_500_000,
        extraMembers: 0,
        memberNames: ["Local Storage Test", "Mahreen Indonesia"],
        href: "/client-portal",
        updatedAt: new Date().toISOString(),
      },
    ],
    scheduleEntries: [
      {
        id: "meeting:local-test",
        startsAt: futureDate.toISOString(),
        month: "AUG",
        day: "09",
        title: "Local Kick-off Meeting",
        description: "Schedule created from local confirmation.",
        time: "10:00 - 11:00 WIB",
        label: "Video Call",
        href: "/client-portal",
      },
    ],
  });
  assert.equal(dashboardSnapshot.projects.length, 1);
  assert.equal(dashboardSnapshot.scheduleEntries.length, 1);
  assert.equal(dashboardSnapshot.projects[0].title, "Local Service Project");
  assert.ok(localStorage.getItem("mahreen:dashboard:projects:v2:local-test-user"));
  assert.ok(localStorage.getItem("mahreen:dashboard:schedule:v2:local-test-user"));

  const { consultationService } = await server.ssrLoadModule(
    "/src/services/consultation/consultationService.ts",
  );
  const consultationResult = await consultationService.submit(
    {
      clientInfo: {
        nama: "Local Consultation Client",
        perusahaan: "Mahreen Local QA",
        email: "consultation@mahreen.test",
        whatsapp: "+628000000002",
        kota: "Jakarta",
      },
      services: ["Strategic Brand Audit"],
      kebutuhan: "Validasi repository Service Management.",
      budget: "Rp 2.000.000 - Rp 5.000.000",
      target: "Secepatnya",
      notes: "Local automated validation.",
      files: [],
      updatedAt: new Date().toISOString(),
    },
    [],
  );

  const { localServiceManagementRepository } = await server.ssrLoadModule(
    "/src/services/serviceManagement/serviceManagementRepository.ts",
  );
  const createdService = localServiceManagementRepository.createService({
    name: "Local Strategy Service",
    category: "Consulting",
    price: 2_500_000,
    status: "Active",
  });
  const updatedService = localServiceManagementRepository.createService(
    {
      name: "Local Strategy Service",
      category: "Consulting",
      price: 3_000_000,
      status: "Active",
      description: "Service detail stored through the local repository.",
      features: ["Strategy Session", "Monthly Report"],
      thumbnail: "data:image/webp;base64,LOCAL_THUMBNAIL",
      gallery: [
        "data:image/webp;base64,LOCAL_GALLERY_1",
        "data:image/webp;base64,LOCAL_GALLERY_2",
        "data:image/webp;base64,LOCAL_GALLERY_3",
        "data:image/webp;base64,LOCAL_GALLERY_4",
      ],
      seoTitle: "Local Strategy Service Mahreen",
      metaDescription: "Local service metadata validation.",
      visibility: "Public",
    },
    createdService.id,
  );
  let serviceSnapshot = localServiceManagementRepository.getSnapshot();
  assert.equal(updatedService.id, createdService.id);
  assert.equal(updatedService.gallery?.length, 4);
  assert.equal(updatedService.features?.length, 2);
  assert.equal(updatedService.visibility, "Public");
  assert.equal(
    serviceSnapshot.services.filter((service) => service.id === createdService.id)
      .length,
    1,
  );
  assert.ok(
    serviceSnapshot.requests.some(
      (request) => request.id === consultationResult.requestId,
    ),
  );
  assert.ok(
    serviceSnapshot.operations.some(
      (operation) => operation.id === "service:local-test",
    ),
  );
  assert.equal(serviceSnapshot.meetings.length, 1);
  assert.equal(serviceSnapshot.metrics.revenueMtd, 1_500_000);

  serviceSnapshot = localServiceManagementRepository.updateRequest(
    consultationResult.requestId,
    { assignedPm: "Admin Mahreen", status: "Reviewed" },
  );
  assert.equal(serviceSnapshot.requests[0].assignedPm, "Admin Mahreen");
  assert.equal(serviceSnapshot.requests[0].status, "Reviewed");

  serviceSnapshot = localServiceManagementRepository.updateOperation(
    "service:local-test",
    { lifecycleStatus: "Active Phase 2", progress: 55, budget: 3_000_000 },
  );
  const updatedOperation = serviceSnapshot.operations.find(
    (operation) => operation.id === "service:local-test",
  );
  assert.equal(updatedOperation?.progress, 55);
  assert.equal(updatedOperation?.budget, 3_000_000);
  assert.ok(localStorage.getItem("mahreen:admin:service-management:v1"));

  assert.equal(serviceSnapshot.projectManagers.length, 3);
  const selectedProjectManager = serviceSnapshot.projectManagers[0];
  const scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const bulkAssignmentInput = {
    requestIds: [consultationResult.requestId],
    projectManagerId: selectedProjectManager.id,
    meetingMode: "Zoom",
    scheduledAt,
    priority: "High Priority",
  };
  const assignmentDraft = localServiceManagementRepository.saveBulkAssignmentDraft(
    bulkAssignmentInput,
  );
  assert.equal(assignmentDraft.status, "Draft");
  assert.equal(
    localServiceManagementRepository.getSnapshot().latestAssignmentDraft?.id,
    assignmentDraft.id,
  );

  serviceSnapshot = localServiceManagementRepository.confirmBulkAssignment(
    bulkAssignmentInput,
  );
  const assignedRequest = serviceSnapshot.requests.find(
    (request) => request.id === consultationResult.requestId,
  );
  assert.equal(assignedRequest?.assignedPm, selectedProjectManager.name);
  assert.equal(assignedRequest?.status, "Scheduled");
  assert.equal(assignedRequest?.priority, "High");
  assert.equal(serviceSnapshot.latestAssignmentDraft, null);
  assert.ok(
    serviceSnapshot.meetings.some(
      (meeting) => meeting.startsAt === scheduledAt && meeting.location === "Zoom",
    ),
  );

  const {
    createDonationDraft,
    markDonationPaid,
    saveDonationDraft,
  } = await server.ssrLoadModule(
    "/src/pages/PeduliMahreen/Donasi/donationStorage.ts",
  );
  const { localCampaignRepository } = await server.ssrLoadModule(
    "/src/services/campaign/campaignRepository.ts",
  );
  const campaignDraft = localCampaignRepository.saveCampaign({
    title: "Local Peduli Campaign",
    category: "Education",
    location: "Jayapura",
    targetAmount: 10_000_000,
    endDate: new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 10),
    pic: "Admin Mahreen",
    story: "Campaign integration validation stored in the local repository.",
    metaDescription: "Local Peduli Mahreen campaign validation.",
    thumbnail: "data:image/webp;base64,LOCAL_CAMPAIGN_THUMBNAIL",
    gallery: [
      "data:image/webp;base64,LOCAL_CAMPAIGN_GALLERY_1",
      "data:image/webp;base64,LOCAL_CAMPAIGN_GALLERY_2",
      "data:image/webp;base64,LOCAL_CAMPAIGN_GALLERY_3",
      "data:image/webp;base64,LOCAL_CAMPAIGN_GALLERY_4",
    ],
    visibility: "Admin Only",
    publishSchedule: "",
    allowAnonymous: true,
    notifySubscribers: false,
    status: "Draft",
  });
  const publishedCampaign = localCampaignRepository.saveCampaign(
    {
      ...campaignDraft,
      title: "Local Peduli Campaign Published",
      visibility: "Public",
      status: "Published",
    },
    campaignDraft.id,
  );
  let campaignSnapshot = localCampaignRepository.getSnapshot();
  assert.equal(publishedCampaign.id, campaignDraft.id);
  assert.equal(publishedCampaign.gallery.length, 4);
  assert.equal(
    campaignSnapshot.campaigns.filter(
      (campaign) => campaign.id === campaignDraft.id,
    ).length,
    1,
  );
  assert.ok(localStorage.getItem("mahreen:admin:peduli-campaigns:v1"));

  saveDonationDraft({
    ...createDonationDraft(125_000),
    campaignId: campaignDraft.id,
    donor: {
      fullName: "Local Peduli Donor",
      email: "peduli-donor@mahreen.test",
      whatsapp: "+628000000003",
      anonymous: false,
      message: "Local donation ledger validation.",
    },
    paymentMethod: "qris",
  });
  markDonationPaid();
  campaignSnapshot = localCampaignRepository.getSnapshot();
  const fundedCampaign = campaignSnapshot.campaigns.find(
    (campaign) => campaign.id === campaignDraft.id,
  );
  assert.equal(fundedCampaign?.collectedAmount, 125_000);
  assert.equal(fundedCampaign?.donorCount, 1);
  assert.ok(campaignSnapshot.metrics.totalCollected >= 125_000);
  assert.ok(localStorage.getItem("mahreen:peduli-donation-history:v1"));

  const { localUserDirectoryRepository } = await server.ssrLoadModule(
    "/src/services/userDirectory/userDirectoryRepository.ts",
  );
  const adminCreatedUser = localUserDirectoryRepository.addUser({
    name: "Admin Created Client",
    email: "admin-created@mahreen.test",
    password: "AdminLocal123!",
    division: "Consultancy",
    role: "Client",
    status: "Active",
  });
  assert.equal(adminCreatedUser.ok, true);
  assert.ok(
    localUserDirectoryRepository
      .getSnapshot()
      .users.some((directoryUser) => directoryUser.email === "admin-created@mahreen.test"),
  );
  const adminCreatedLogin = await authService.login({
    email: "admin-created@mahreen.test",
    password: "AdminLocal123!",
    remember: false,
  });
  assert.equal(adminCreatedLogin.user.role, "client");

  const { localAdminOperationsRepository } = await server.ssrLoadModule(
    "/src/services/admin/adminOperationsRepository.ts",
  );
  const commandCenter = localAdminOperationsRepository.getCommandCenterSnapshot();
  assert.ok(commandCenter.transactions.some((transaction) => transaction.division === "Donations"));
  assert.ok(commandCenter.metrics.totalRevenue >= 125_000);
  const verification = localAdminOperationsRepository.getVerificationSnapshot();
  const identityRequest = verification.requests.find(
    (request) => request.ownerEmail === "admin-created@mahreen.test",
  );
  assert.ok(identityRequest);
  const updatedVerification = localAdminOperationsRepository.updateVerificationStatus(
    identityRequest.id,
    "Under Review",
  );
  assert.equal(
    updatedVerification.requests.find((request) => request.id === identityRequest.id)?.status,
    "Under Review",
  );

  console.log(
    "Local auth, Admin-user bridge, Newsroom CRUD, dashboard, Service Management, campaigns, donations, verification, and bulk assignment validation passed.",
  );
} finally {
  await server.close();
}
