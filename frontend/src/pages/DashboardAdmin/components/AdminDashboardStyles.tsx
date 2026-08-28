import adminDashboardCss from "../AdminDashboard.css?inline";
import adminFeaturePagesCss from "../AdminFeaturePages.css?inline";
import adminLightThemeCss from "../AdminLightTheme.css?inline";

const AdminDashboardStyles = () => (
  <style>{`${adminDashboardCss}\n${adminFeaturePagesCss}\n${adminLightThemeCss}`}</style>
);

export default AdminDashboardStyles;
