import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

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

interface LeadsTableProps {
  leads: Lead[];
}

export default function LeadsTable({ leads }: LeadsTableProps) {
  const navigate = useNavigate();

  if (leads.length === 0) {
    return <p>No leads found.</p>;
  }

  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#F9FAFB", textAlign: "left" }}>
            <th
              style={{
                padding: "14px",
                borderBottom: "1px solid #e5e7eb",
                fontSize: "12px",
                fontWeight: 700,
                color: "#6B7280",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Full Name
            </th>
            <th
              style={{
                padding: "14px",
                borderBottom: "1px solid #e5e7eb",
                fontSize: "12px",
                fontWeight: 700,
                color: "#6B7280",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Email
            </th>
            <th
              style={{
                padding: "14px",
                borderBottom: "1px solid #e5e7eb",
                fontSize: "12px",
                fontWeight: 700,
                color: "#6B7280",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Status
            </th>
            <th
              style={{
                padding: "14px",
                borderBottom: "1px solid #e5e7eb",
                fontSize: "12px",
                fontWeight: 700,
                color: "#6B7280",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Assigned To
            </th>
            <th
              style={{
                padding: "14px",
                borderBottom: "1px solid #e5e7eb",
                fontSize: "12px",
                fontWeight: 700,
                color: "#6B7280",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Created At
            </th>
            <th
              style={{
                padding: "14px",
                borderBottom: "1px solid #e5e7eb",
                fontSize: "12px",
                fontWeight: 700,
                color: "#6B7280",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "12px" }}>{lead.full_name}</td>
              <td style={{ padding: "12px" }}>{lead.email}</td>
              <td style={{ padding: "12px" }}>
                <StatusBadge status={lead.status} />
              </td>
              <td style={{ padding: "12px" }}>
                {lead.assigned_rep_name || "Unassigned"}
              </td>
              <td style={{ padding: "12px" }}>
                {lead.created_at
                  ? new Date(lead.created_at).toLocaleDateString()
                  : "N/A"}
              </td>
              <td style={{ padding: "12px" }}>
                <button
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#EEF2FF",
                    color: "#4338CA",
                    border: "1px solid #C7D2FE",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
