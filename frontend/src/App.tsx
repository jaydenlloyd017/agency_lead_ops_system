import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Leads from "./pages/Leads";
import LeadDetail from "./pages/LeadDetail";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/leads/:id" element={<LeadDetail />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
