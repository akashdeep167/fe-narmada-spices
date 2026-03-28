import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import InventoryRegister from "./pages/InventoryRegister";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ToastProvider } from "./providers/toast-provider";
import { useTokenExpiration } from "./hooks/useTokenExpiration";
import { useClearCacheOnLogout } from "./hooks/useClearCacheOnLogout";
import QueryProvider from "./providers/query-provider";
// import InventorySlipForm from "./components/forms/InventorySlipForm";

function AppContent() {
  useTokenExpiration();
  useClearCacheOnLogout();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <InventoryRegister />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
      {/* <Route path="/entry" element={<InventorySlipForm />} /> */}
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <ToastProvider />
          <AppContent />
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  );
}

export default App;
