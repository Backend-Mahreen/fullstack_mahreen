const http = require("http");
const BASE = "http://localhost:3000";

const req = (method, path, body, extraHeaders = {}) =>
  new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const data = body ? JSON.stringify(body) : null;
    const headers = { Accept: "application/json" };
    if (data) headers["Content-Type"] = "application/json";
    Object.assign(headers, extraHeaders);
    const r = http.request(url, { method, headers }, (res) => {
      let c = "";
      res.on("data", d => c += d);
      res.on("end", () => { let j = null; try { j = JSON.parse(c); } catch {} resolve({ status: res.statusCode, hdr: res.headers, body: j }); });
    });
    r.on("error", reject);
    if (data) r.write(data);
    r.end();
  });

const parseCookies = (hdr) => {
  const sc = hdr["set-cookie"] || [];
  const out = {};
  sc.forEach(s => { const m = s.match(/^([^=]+)=([^;]+)/); if (m) out[m[1]] = m[2]; });
  return out;
};

const cstr = (c) => Object.entries(c).map(([k,v]) => k+"="+v).join("; ");

(async () => {
  let P=0,F=0;
  const T=(n,ok)=>{if(ok){P++;process.stdout.write("  PASS  "+n+"\n")}else{F++;process.stdout.write("  FAIL  "+n+"\n")}};

  // 1. Login admin
  const adm = await req("POST","/api/auth/admin/login",{email:"admin@mahreen.id",password:"AdminMahreen123!"});
  T("login ok", adm.body?.data?.session?.accessToken?.length>20);
  const admCookie = parseCookies(adm.hdr);

  // 2. HttpOnly cookie
  const rawSC = (adm.hdr["set-cookie"]||[]).join(" | ");
  T("HttpOnly flag", rawSC.includes("HttpOnly"));
  T("SameSite=Strict", rawSC.includes("SameSite=Strict"));
  T("Path=/api/auth", rawSC.includes("Path=/api/auth"));
  T("refreshToken NOT in body", !adm.body?.data?.session?.hasOwnProperty("refreshToken"));

  // 3. Client login
  const cli = await req("POST","/api/auth/login",{email:"client@mahreen.id",password:"Client123!"});
  const cliCookie = parseCookies(cli.hdr);
  T("client login ok", cli.body?.data?.session?.accessToken?.length>20);
  T("client cookie != admin cookie", cliCookie.refreshToken !== admCookie.refreshToken);

  // 4. First refresh
  const r1 = await req("POST","/api/auth/refresh",{},{"Cookie": cstr(cliCookie)});
  T("first refresh ok (200)", r1.status===200);
  if (r1.status === 200) T("new accessToken issued", r1.body?.data?.session?.accessToken?.length>20);
  const r1Cookies = parseCookies(r1.hdr);
  const newRefresh = r1Cookies.refreshToken || cliCookie.refreshToken;
  T("cookie rotated (new != old)", r1Cookies.refreshToken !== undefined && r1Cookies.refreshToken !== cliCookie.refreshToken);

  // 5. Old token rejected
  const r2 = await req("POST","/api/auth/refresh",{},{"Cookie": cstr(cliCookie)});
  T("old refresh rejected (401)", r2.status===401);

  // 6. New token valid
  const r3 = await req("POST","/api/auth/refresh",{},{"Cookie": cstr({refreshToken:newRefresh})});
  T("new token valid (200)", r3.status===200);
  const r3Cookies = parseCookies(r3.hdr);
  const newerRefresh = r3Cookies.refreshToken || newRefresh;
  T("rotation continues (3rd token different)", newerRefresh !== newRefresh);

  // 7. r1 token now rejected
  const r4 = await req("POST","/api/auth/refresh",{},{"Cookie": cstr({refreshToken:newRefresh})});
  T("r1 token rejected after rotation (401)", r4.status===401);

  // 8. Admin endpoints with Bearer auth
  let bad=0;
  const eps=["/api/admin/overview/stats","/api/admin/users?limit=2","/api/admin/newsroom/articles?limit=2","/api/admin/tanya-mahreen/stats","/api/admin/peduli-mahreen/stats","/api/admin/csr/stats","/api/admin/studio/stats","/api/admin/internship/stats","/api/admin/verification/stats","/api/admin/analytics/overview"];
  for (const e of eps) {
    const r = await req("GET",e,null,{"Authorization": "Bearer "+adm.body.data.session.accessToken});
    if (r.status!==200) { bad++; process.stdout.write("  FAIL  "+e+" -> "+r.status+"\n"); }
  }
  T(eps.length+" admin endpoints 200 (bad="+bad+")", bad===0);

  console.log("\nRESULT: PASS="+P+"  FAIL="+F);
})();
