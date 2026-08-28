import { AuthProvider } from "./context/AuthProvider";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <div className="app-shell">
        <a className="skip-link" href="#main-content">
          Lewati ke konten utama
        </a>
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
