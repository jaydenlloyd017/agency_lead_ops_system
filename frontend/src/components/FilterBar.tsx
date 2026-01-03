interface FilterBarProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

const allStatuses = [
  "ALL",
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL",
  "WON",
  "LOST",
];

export default function FilterBar({
  statusFilter,
  onStatusFilterChange,
}: FilterBarProps) {
  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "15px",
        backgroundColor: "#f9fafb",
        borderRadius: "4px",
      }}
    >
      <label
        htmlFor="status-filter"
        style={{ marginRight: "10px", fontWeight: "500" }}
      >
        Filter by Status:
      </label>
      <select
        id="status-filter"
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        style={{
          padding: "8px",
          fontSize: "14px",
          borderRadius: "4px",
          border: "1px solid #d1d5db",
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
