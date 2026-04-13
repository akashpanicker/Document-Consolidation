interface RegionNavItemProps {
  regionName: string;
  isActive: boolean;
  isConfigured: boolean;
  onClick: () => void;
}

export function RegionNavItem({
  regionName,
  isActive,
  isConfigured,
  onClick,
}: RegionNavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-lg px-2 py-2 transition-colors cursor-pointer"
      style={{
        border: "none",
        backgroundColor: isActive ? "var(--bg-hover)" : "transparent",
        fontFamily: "Inter, sans-serif",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = "var(--bg-hover)";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <span
        className="text-[13px] font-semibold leading-tight"
        style={{
          color: isActive ? "var(--color-brand)" : "var(--text-secondary)",
        }}
      >
        {regionName}
      </span>

      {/* Status caption */}
      <span
        className="text-[11px] leading-tight mt-1 block"
        style={{
          color: isConfigured ? "var(--color-positive)" : "var(--text-muted)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {isConfigured ? "Configured" : "Not configured"}
      </span>
    </button>
  );
}
