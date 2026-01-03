interface StatusBadgeProps {
  status: string;
}

const statusColors: { [key: string]: string } = {
  NEW: "#3b82f6",
  CONTACTED: "#8b5cf6",
  QUALIFIED: "#10b981",
  PROPOSAL: "#f59e0b",
  WON: "#22c55e",
  LOST: "#ef4444",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const color = statusColors[status] || "#6b7280";

  return (
    <span
      style={{
        backgroundColor: color,
        color: "white",
        padding: "4px 12px",
        borderRadius: "4px",
        fontSize: "14px",
        fontWeight: "500",
      }}
    >
      {status}
    </span>
  );
}
