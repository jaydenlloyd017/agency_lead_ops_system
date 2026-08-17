interface FilterBarProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

const allStatuses = [
  "ALL",
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "BOOKED",
  "CLOSED_WON",
  "CLOSED_LOST",
];

export default function FilterBar({
  statusFilter,
  onStatusFilterChange,
}: FilterBarProps) {
  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        padding: "18px",
        marginBottom: "18px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: "6px",
          fontSize: "13px",
          fontWeight: 600,
          color: "#6b7280",
        }}
      >
        Filter by Status
      </label>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        style={{
          padding: "9px 12px",
          minWidth: "180px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          backgroundColor: "white",
          fontSize: "14px",
        }}
      >
        {allStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}
