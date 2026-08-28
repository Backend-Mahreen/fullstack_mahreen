const fs = require("fs");
const path = require("path");

const base = "D:/Assignment/Magang/Mahreen Intern/Project/mahreen-indonesia/backend/src";

// auth.js — replace console.error with logger
let auth = fs.readFileSync(path.join(base, "routes/auth.js"), "utf8");
if (!auth.includes('require("../utils/logger")')) {
  auth = auth.replace(
    'const { sendSuccess, sendError } = require("../utils/response");',
    'const logger = require("../utils/logger");\nconst { sendSuccess, sendError } = require("../utils/response");'
  );
}
auth = auth.replace(/console\.error\("Register error:", error\);/g, 'logger.error(error, "register");');
auth = auth.replace(/console\.error\("Login error:", error\);/g, 'logger.error(error, "login");');
auth = auth.replace(/console\.error\("Admin login error:", error\);/g, 'logger.error(error, "admin-login");');
auth = auth.replace(/console\.error\("Refresh token error:", error\);/g, 'logger.error(error, "refresh");');
auth = auth.replace(/console\.error\("Logout error:", error\);/g, 'logger.error(error, "logout");');
auth = auth.replace(/console\.error\("Get me error:", error\);/g, 'logger.error(error, "me");');
fs.writeFileSync(path.join(base, "routes/auth.js"), auth);
console.log("auth.js patched");

// admin/index.js — replace console.error with logger
let adminIndex = fs.readFileSync(path.join(base, "routes/admin/index.js"), "utf8");
if (!adminIndex.includes('require("../../utils/logger")')) {
  adminIndex = adminIndex.replace(
    'const { sendError } = require("../../utils/response");',
    'const logger = require("../../utils/logger");\nconst { sendError } = require("../../utils/response");'
  );
}
adminIndex = adminIndex.replace(
  /console\.error\(`Admin API error \$\{req\.method\} \$\{req\.originalUrl\}:`, err\);/g,
  'logger.error(err, `admin ${req.method} ${req.originalUrl}`);'
);
fs.writeFileSync(path.join(base, "routes/admin/index.js"), adminIndex);
console.log("admin/index.js patched");

// _helpers.js — replace console.warn with logger
let helpers = fs.readFileSync(path.join(base, "routes/admin/_helpers.js"), "utf8");
if (!helpers.includes('require("../../utils/logger")')) {
  helpers = helpers.replace(
    'const { runQuery, runSingle, runExecute, withTransaction } = require("../../config/database");',
    'const logger = require("../../utils/logger");\nconst { runQuery, runSingle, runExecute, withTransaction } = require("../../config/database");'
  );
}
helpers = helpers.replace(/console\.warn\("Gagal menulis audit log:", error\.message\);/g, 'logger.warn(`Gagal menulis audit log: ${error.message}`);');
helpers = helpers.replace(/console\.warn\("Gagal menulis system activity:", error\.message\);/g, 'logger.warn(`Gagal menulis system activity: ${error.message}`);');
fs.writeFileSync(path.join(base, "routes/admin/_helpers.js"), helpers);
console.log("admin/_helpers.js patched");

console.log("CODE25 done — all console.error/warn replaced with logger");
