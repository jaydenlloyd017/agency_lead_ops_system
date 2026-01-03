interface HistoryItem {
  id: number;
  lead_id: number;
  old_status: string;
  new_status: string;
  changed_at: string;
  changed_by?: number;
}

interface HistoryTimelineProps {
  history: HistoryItem[];
}

export default function HistoryTimeline({ history }: HistoryTimelineProps) {
  if (history.length === 0) {
    return <p>No status changes yet.</p>;
  }

  return (
    <div>
      {history.map((item) => (
        <div
          key={item.id}
          style={{
            borderLeft: "3px solid #3b82f6",
            paddingLeft: "15px",
            marginBottom: "15px",
            paddingBottom: "10px",
          }}
        >
          <div style={{ fontSize: "16px", fontWeight: "500" }}>
            {item.old_status} → {item.new_status}
          </div>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            {new Date(item.changed_at).toLocaleString()}
          </div>
          {item.changed_by && (
            <div style={{ fontSize: "12px", color: "#9ca3af" }}>
              Changed by user ID: {item.changed_by}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
