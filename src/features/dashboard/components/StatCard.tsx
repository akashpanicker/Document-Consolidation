interface StatCardProps {
  label: string;
  value: number;
  supportingText: string;
  valueColor?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export function StatCard({
  label,
  value,
  supportingText,
  valueColor,
  onClick,
  isActive,
}: StatCardProps) {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`flex flex-col gap-2 p-5 rounded-[8px] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isClickable
          ? "cursor-pointer group hover:translate-y-[-4px] active:scale-[0.98] shadow-none hover:shadow-md"
          : "shadow-none"
      }`}
      style={{
        backgroundColor: "var(--bg-card)",
        border: isActive ? "1px solid var(--color-brand)" : "var(--border-default)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated glow on hover */}
      {isClickable && !isActive && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "linear-gradient(135deg, rgba(111, 143, 217, 0.12) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />
      )}

      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          color: isActive ? "var(--color-brand)" : "var(--text-muted)",
          fontFamily: "Inter, sans-serif",
          transition: "color 0.3s ease",
          zIndex: 1,
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
          zIndex: 1,
          transition: "transform 0.3s ease",
        }}
        className={isClickable ? "group-hover:translate-x-1" : ""}
      >
        {value.toLocaleString()}
      </span>
      <span
        style={{
          fontSize: 12,
          color: "var(--text-muted)",
          fontFamily: "Inter, sans-serif",
          zIndex: 1,
        }}
      >
        {supportingText}
      </span>
      
      {/* Indicator bar for active state */}
      {isActive && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{ backgroundColor: "var(--color-brand)" }}
        />
      )}
    </div>
  );
}
