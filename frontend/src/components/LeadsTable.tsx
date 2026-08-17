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
          <tr style={{ backgroundColor: "#f3f4f6", textAlign: "left" }}>
            <th style={{ padding: "12px", borderBottom: "2px solid #e5e7eb" }}>
              Full Name
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #e5e7eb" }}>
              Email
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #e5e7eb" }}>
              Status
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #e5e7eb" }}>
              Assigned To
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #e5e7eb" }}>
              Created At
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #e5e7eb" }}>
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
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
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
