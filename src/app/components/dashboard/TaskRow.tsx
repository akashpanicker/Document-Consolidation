import { ConsolidationTask } from "../../types/dashboard.types";

const DOC_TYPE_STYLES: Record<ConsolidationTask["documentType"], { bg: string; color: string }> = {
  Procedure: { bg: "rgba(16,185,129,0.12)", color: "#10b981" },
  Policy:    { bg: "rgba(139,92,246,0.12)", color: "#8b5cf6" },
  Standard:  { bg: "rgba(43,85,151,0.12)",  color: "var(--color-brand)" },
  Checklist: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" },
};

interface TaskRowProps {
  task: ConsolidationTask;
  onReview: (id: string) => void;
}

export function TaskRow({ task, onReview }: TaskRowProps) {
  const typeStyle = DOC_TYPE_STYLES[task.documentType];

  return (
    <div
      className="flex flex-col gap-2 px-4 py-3"
      style={{ borderBottom: "var(--border-subtle)" }}
    >
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text-primary)",
              fontFamily: "Inter, sans-serif",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {task.documentName}
          </span>
          <span
            style={{
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 4,
              backgroundColor: typeStyle.bg,
              color: typeStyle.color,
              fontFamily: "Inter, sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            {task.documentType}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onReview(task.id)}
          style={{
            flexShrink: 0,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
            padding: "5px 14px",
            borderRadius: 6,
            backgroundColor: "transparent",
            border: "var(--border-default)",
            color: "var(--text-secondary)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--bg-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          {task.status === "completed" ? "View" : "Review"}
        </button>
      </div>

      {task.status === "completed" ? (
        <div className="flex items-center gap-2 mt-1">
          <span
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Completed by {task.completedBy} on {task.completedAt}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              fontFamily: "Inter, sans-serif",
              flexShrink: 0,
            }}
          >
            Reviewer {task.reviewerPosition} of {task.totalReviewers}
          </span>
          <div className="flex-1 h-[5px] rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-hover)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${task.progressPercent}%`,
                backgroundColor: "var(--color-brand)",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-muted)",
              fontFamily: "Inter, sans-serif",
              flexShrink: 0,
              minWidth: 32,
              textAlign: "right",
            }}
          >
            {task.progressPercent}%
          </span>
        </div>
      )}
    </div>
  );
}
