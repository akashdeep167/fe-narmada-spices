import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import InventoryRegister from "./pages/InventoryRegister";
import InventorySlipForm from "./components/forms/InventorySlipForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<InventoryRegister />} />
        <Route path="/entry" element={<InventorySlipForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
