import { useRef, useEffect } from "react";
import { GovernanceStage } from "../governance.types";
import { REGIONS } from "../../new-consolidation/data/regions";

interface CopyFromRegionDropdownProps {
  currentRegionId: string;
  savedStagesByRegion: Record<string, GovernanceStage[] | null>;
  onSelect: (regionId: string) => void;
  onClose: () => void;
}

export function CopyFromRegionDropdown({
  currentRegionId,
  savedStagesByRegion,
  onSelect,
  onClose,
}: CopyFromRegionDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const otherRegions = REGIONS.filter(r => r.value !== currentRegionId);
  const anyConfigured = otherRegions.some(r => savedStagesByRegion[r.value] !== null);

  return (
    <div
      ref={ref}
      className="absolute right-0 z-50 rounded-[6px] py-1.5"
      style={{
        top: "calc(100% + 6px)",
        minWidth: 240,
        backgroundColor: "var(--bg-card)",
        border: "var(--border-default)",
        boxShadow: "var(--shadow-dropdown)",
      }}
    >
      {/* Header label */}
      <div
        className="px-3 pb-1.5"
        style={{ borderBottom: "var(--border-default)" }}
      >
        <span
          className="text-[11px] font-bold uppercase tracking-widest"
          style={{
            color: "var(--text-muted)",
            letterSpacing: "0.08em",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Copy from region
        </span>
      </div>

      {!anyConfigured ? (
        <div className="px-3 py-3">
          <span
            className="text-[13px]"
            style={{ color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}
          >
            No other regions configured yet
          </span>
        </div>
      ) : (
        <div className="py-1">
          {otherRegions.map(region => {
            const saved = savedStagesByRegion[region.value];
            const isConfigured = saved !== null;
            const stageCount = saved?.length ?? 0;

            return (
              <button
                key={region.value}
                type="button"
                disabled={!isConfigured}
                onClick={() => {
                  if (isConfigured) onSelect(region.value);
                }}
                className="w-full text-left flex items-center justify-between px-3 py-2 transition-colors"
                style={{
                  background: "none",
                  border: "none",
                  cursor: isConfigured ? "pointer" : "not-allowed",
                  fontFamily: "Inter, sans-serif",
                  opacity: isConfigured ? 1 : 0.5,
                }}
                onMouseEnter={(e) => {
                  if (isConfigured)
                    e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span
                  className="text-[13px] font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {region.label}
                </span>

                <span
                  className="text-[12px] ml-3 shrink-0"
                  style={{ color: isConfigured ? "var(--text-muted)" : "var(--text-muted)" }}
                >
                  {isConfigured
                    ? `${stageCount} ${stageCount === 1 ? "stage" : "stages"}`
                    : "Not configured"}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
