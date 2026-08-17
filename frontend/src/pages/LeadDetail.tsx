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
  assigned_rep_name?: string;
  created_at?: string;
}

interface HistoryItem {
  id: number;
  lead_id: number;
  from_status: string;
  to_status: string;
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
        {
          new_status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

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

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#F5F7FB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          color: "#6B7280",
        }}
      >
        Loading lead...
      </div>
    );
  }

  if (!lead) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#F5F7FB",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        Lead not found
      </div>
    );
  }

  const labelStyle = {
    fontSize: "12px",
    fontWeight: 700,
    color: "#6B7280",
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
    marginBottom: "6px",
  };

  const valueStyle = {
    margin: 0,
    fontSize: "15px",
    color: "#111827",
    fontWeight: 500,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F5F7FB",
        padding: "32px",
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#111827",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        <button
          onClick={() => navigate("/leads")}
          style={{
            marginBottom: "22px",
            backgroundColor: "transparent",
            border: "none",
            color: "#4F46E5",
            fontWeight: 600,
            cursor: "pointer",
            padding: 0,
          }}
        >
          ← Back to Leads
        </button>

        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#6B7280",
              fontWeight: 600,
            }}
          >
            Agency Lead Operations
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "4px",
              flexWrap: "wrap",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "30px",
                letterSpacing: "-0.03em",
              }}
            >
              {lead.full_name}
            </h1>

            <StatusBadge status={lead.status} />
          </div>

          <p
            style={{
              margin: "8px 0 0",
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            View lead information, update pipeline status and review activity.
          </p>
        </div>

        {error && (
          <div
            style={{
              color: "#B91C1C",
              padding: "11px 12px",
              backgroundColor: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "13px",
            }}
          >
            {error}
          </div>
        )}

        {/* Lead Information */}
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "14px",
            padding: "24px",
            marginBottom: "18px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              marginBottom: "22px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "18px",
              }}
            >
              Lead Information
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                color: "#6B7280",
                fontSize: "13px",
              }}
            >
              Contact and assignment details for this lead.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px",
            }}
          >
            <div>
              <div style={labelStyle}>Full Name</div>
              <p style={valueStyle}>{lead.full_name}</p>
            </div>

            <div>
              <div style={labelStyle}>Email</div>
              <p style={valueStyle}>{lead.email}</p>
            </div>

            <div>
              <div style={labelStyle}>Phone</div>
              <p style={valueStyle}>{lead.phone || "Not provided"}</p>
            </div>

            <div>
              <div style={labelStyle}>Source</div>
              <p
                style={{
                  ...valueStyle,
                  textTransform: "capitalize",
                }}
              >
                {lead.source || "Not provided"}
              </p>
            </div>

            <div>
              <div style={labelStyle}>Assigned To</div>
              <p style={valueStyle}>{lead.assigned_rep_name || "Unassigned"}</p>
            </div>

            <div>
              <div style={labelStyle}>Created</div>
              <p style={valueStyle}>
                {lead.created_at
                  ? new Date(lead.created_at).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Status Update */}
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "14px",
            padding: "24px",
            marginBottom: "18px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "18px",
            }}
          >
            Update Status
          </h2>

          <p
            style={{
              margin: "5px 0 18px",
              color: "#6B7280",
              fontSize: "13px",
            }}
          >
            Move this lead through the sales pipeline.
          </p>

          <StatusDropdown
            currentStatus={lead.status}
            onStatusChange={handleStatusChange}
          />
        </div>

        {/* History */}
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid #E5E7EB",
            borderRadius: "14px",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "18px",
            }}
          >
            Status History
          </h2>

          <p
            style={{
              margin: "5px 0 20px",
              color: "#6B7280",
              fontSize: "13px",
            }}
          >
            A timeline of status changes for this lead.
          </p>

          <HistoryTimeline history={history} />
        </div>
      </div>
    </div>
  );
}
