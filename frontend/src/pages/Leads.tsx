import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LeadsTable from "../components/LeadsTable";
import FilterBar from "../components/FilterBar";

interface Lead {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  source?: string;
  status: string;
  assigned_to?: number;
  created_at?: string;
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token);
        console.log("Authorization header:", `Bearer ${token}`);

        if (!token) {
          navigate("/");
          return;
        }

        const response = await axios.get("http://localhost:8000/leads", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeads(response.data);
      } catch (error) {
        console.error("Error fetching leads:", error);
        setError("Failed to fetch leads");
        // Redirect to login if unauthorized
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate("/");
        }
      }
    };

    fetchLeads();
  }, [navigate]);

  // Filter leads using useMemo
  const filteredLeads = useMemo(() => {
    if (statusFilter === "ALL") {
      return leads;
    }
    return leads.filter((lead) => lead.status === statusFilter);
  }, [statusFilter, leads]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Leads Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <FilterBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <LeadsTable leads={filteredLeads} />
    </div>
  );
}
