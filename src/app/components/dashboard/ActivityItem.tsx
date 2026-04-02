import { ActivityItem as ActivityItemType } from "../../types/dashboard.types";

const ACTION_BORDER_COLOR: Record<ActivityItemType["actionType"], string> = {
  approved: "var(--color-success)",
  rejected: "var(--color-error)",
  created:  "var(--color-brand)",
};

interface ActivityItemProps {
  item: ActivityItemType;
}

export function ActivityItem({ item }: ActivityItemProps) {
  const borderColor = ACTION_BORDER_COLOR[item.actionType];

  return (
    <div
      className="flex gap-0 px-4 py-3"
      style={{
        borderBottom: "var(--border-subtle)",
        borderLeft: `3px solid ${borderColor}`,
      }}
    >
      <div className="flex flex-col gap-1 min-w-0">
        <span
          style={{
            fontSize: 13,
            color: "var(--text-primary)",
            fontFamily: "Inter, sans-serif",
            lineHeight: 1.4,
          }}
        >
          {item.description}
        </span>
        <span
          style={{
            fontSize: 11,
            color: "var(--text-muted)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {item.relativeTime}
        </span>
      </div>
    </div>
  );
}
