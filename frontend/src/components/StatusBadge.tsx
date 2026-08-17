interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, { backgroundColor: string; color: string }> =
  {
    NEW: {
      backgroundColor: "#DBEAFE",
      color: "#1D4ED8",
    },
    CONTACTED: {
      backgroundColor: "#EDE9FE",
      color: "#6D28D9",
    },
    QUALIFIED: {
      backgroundColor: "#D1FAE5",
      color: "#047857",
    },
    BOOKED: {
      backgroundColor: "#FEF3C7",
      color: "#B45309",
    },
    CLOSED_WON: {
      backgroundColor: "#DCFCE7",
      color: "#15803D",
    },
    CLOSED_LOST: {
      backgroundColor: "#FEE2E2",
      color: "#B91C1C",
    },
  };

export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] || {
    backgroundColor: "#F3F4F6",
    color: "#4B5563",
  };

  return (
    <span
      style={{
        backgroundColor: style.backgroundColor,
        color: style.color,
        padding: "4px 12px",
        borderRadius: "4px",
        fontSize: "14px",
        fontWeight: "500",
      }}
    >
      {status
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}
    </span>
  );
}
