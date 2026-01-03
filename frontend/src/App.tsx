import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Leads from "./pages/Leads";
import LeadDetail from "./pages/LeadDetail";
import CreateLead from "./pages/CreateLead";
import CreateUser from "./pages/CreateUser";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/leads/:id" element={<LeadDetail />} />
          <Route path="/create-lead" element={<CreateLead />} />
          <Route path="/create-user" element={<CreateUser />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
