interface StatCardProps {
  label: string;
  value: number;
  supportingText: string;
  valueColor?: string;
}

export function StatCard({ label, value, supportingText, valueColor }: StatCardProps) {
  return (
    <div
      className="flex flex-col gap-2 p-5 rounded-[8px]"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "var(--border-default)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          color: "var(--text-muted)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 36,
          fontWeight: 700,
          lineHeight: 1,
          color: valueColor ?? "var(--text-primary)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {value.toLocaleString()}
      </span>
      <span
        style={{
          fontSize: 12,
          color: "var(--text-muted)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {supportingText}
      </span>
    </div>
  );
}
