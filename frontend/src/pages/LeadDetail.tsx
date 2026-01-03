import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import StatusBadge from "../components/StatusBadge";
import StatusDropdown from "../components/StatusDropdown";
import HistoryTimeline from "../components/HistoryTimeline";

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

interface HistoryItem {
  id: number;
  lead_id: number;
  old_status: string;
  new_status: string;
  changed_at: string;
  changed_by?: number;
}

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLead = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/api/leads/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLead(response.data);
      setError("");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        navigate("/");
      } else {
        setError("Failed to load lead details");
      }
    }
  }, [id, navigate]);

  const fetchHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/leads/${id}/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHistory(response.data);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  }, [id]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchLead();
      await fetchHistory();
      setLoading(false);
    };
    loadData();
  }, [fetchLead, fetchHistory]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8000/api/leads/${id}/status`,
        { new_status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Refresh data
      await fetchLead();
      await fetchHistory();
      setError("");
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.detail
          ? err.response.data.detail
          : "Failed to update status";
      setError(errorMessage);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!lead) return <div>Lead not found</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <button
        onClick={() => navigate("/leads")}
        style={{ marginBottom: "20px" }}
      >
        ← Back to Leads
      </button>

      <h1>Lead Details</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Lead Info Section */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>Information</h2>
        <table style={{ width: "100%" }}>
          <tbody>
            <tr>
              <td>
                <strong>Name:</strong>
              </td>
              <td>{lead.full_name}</td>
            </tr>
            <tr>
              <td>
                <strong>Email:</strong>
              </td>
              <td>{lead.email}</td>
            </tr>
            <tr>
              <td>
                <strong>Phone:</strong>
              </td>
              <td>{lead.phone || "N/A"}</td>
            </tr>
            <tr>
              <td>
                <strong>Source:</strong>
              </td>
              <td>{lead.source || "N/A"}</td>
            </tr>
            <tr>
              <td>
                <strong>Status:</strong>
              </td>
              <td>
                <StatusBadge status={lead.status} />
              </td>
            </tr>
            <tr>
              <td>
                <strong>Assigned To:</strong>
              </td>
              <td>{lead.assigned_to || "Unassigned"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Status Update Section */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>Update Status</h2>
        <StatusDropdown
          currentStatus={lead.status}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* History Timeline */}
      <div style={{ border: "1px solid #ddd", padding: "20px" }}>
        <h2>Status History</h2>
        <HistoryTimeline history={history} />
      </div>
    </div>
  );
}
