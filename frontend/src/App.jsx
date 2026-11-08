import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import ParentPortal from "./pages/ParentPortal";
import Refunds from "./pages/Refunds";
import Reminders from "./pages/Reminders";
import RiskAssessment from "./pages/RiskAssessment";
import AccountsManagement from "./pages/AccountsManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/students" element={<Students />} />

        <Route path="/parent" element={<ParentPortal />} />

        <Route path="*" element={<Navigate to="/" />} />

        <Route path="/refunds" element={<Refunds />} />
        
        <Route path="/reminders" element={<Reminders />} />

        <Route path="/risk" element={<RiskAssessment />} />

        <Route path="/management" element={<AccountsManagement />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;