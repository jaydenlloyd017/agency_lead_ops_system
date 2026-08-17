import { useState } from "react";

interface StatusDropdownProps {
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
}

// Define valid status transitions
const statusTransitions: { [key: string]: string[] } = {
  NEW: ["CONTACTED"],
  CONTACTED: ["QUALIFIED", "CLOSED_LOST"],
  QUALIFIED: ["BOOKED", "CLOSED_LOST"],
  BOOKED: ["CLOSED_WON", "CLOSED_LOST"],
  CLOSED_WON: [],
  CLOSED_LOST: [],
};

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function StatusDropdown({
  currentStatus,
  onStatusChange,
}: StatusDropdownProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const allowedStatuses = statusTransitions[currentStatus] || [];

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    setIsUpdating(true);

    try {
      await onStatusChange(newStatus);
    } catch {
      // Revert on error
      setSelectedStatus(currentStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  if (allowedStatuses.length === 0) {
    return (
      <p>
        No further status changes available for {formatStatus(currentStatus)}
      </p>
    );
  }

  return (
    <div>
      <label htmlFor="status-select" style={{ marginRight: "10px" }}>
        <strong>Change Status:</strong>
      </label>
      <select
        id="status-select"
        value={selectedStatus}
        onChange={handleChange}
        disabled={isUpdating}
        style={{ padding: "8px", fontSize: "14px" }}
      >
        <option value={currentStatus}>
          Current: {formatStatus(currentStatus)}
        </option>
        {allowedStatuses.map((status) => (
          <option key={status} value={status}>
            {formatStatus(status)}
          </option>
        ))}
      </select>
      {isUpdating && <span style={{ marginLeft: "10px" }}>Updating...</span>}
    </div>
  );
}
