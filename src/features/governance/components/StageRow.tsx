import { X } from "lucide-react";
import { SearchableSelect } from "../../new-consolidation/components/SearchableSelect";
import { GovernanceUser } from "../governance.types";

interface StageRowProps {
  stageNumber: number;
  selectedUser: string;
  userOptions: GovernanceUser[];
  onUserChange: (userId: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function StageRow({
  stageNumber,
  selectedUser,
  userOptions,
  onUserChange,
  onRemove,
  canRemove,
}: StageRowProps) {
  const selectOptions = userOptions.map((u) => ({
    value: u.id,
    label: `${u.name} · ${u.role}`,
  }));

  return (
    <div className="flex items-center gap-4">
      {/* Stage label — fixed width so all dropdowns align */}
      <span
        style={{
          width: 64,
          flexShrink: 0,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          color: "var(--text-muted)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        Stage {stageNumber}
      </span>

      {/* Reviewer selector — same component as New Consolidation screen */}
      <div className="flex-1">
        <SearchableSelect
          label=""
          value={selectedUser}
          onChange={onUserChange}
          options={selectOptions}
          placeholder="Select reviewer..."
          hideClear
        />
      </div>

      {/* Remove button — destructive style */}
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        title={canRemove ? "Remove stage" : "At least one stage is required"}
        className="flex items-center justify-center rounded-[6px] transition-colors shrink-0"
        style={{
          width: 32,
          height: 32,
          border: "none",
          cursor: canRemove ? "pointer" : "not-allowed",
          backgroundColor: "transparent",
          color: canRemove ? "var(--color-negative, #ef4444)" : "var(--text-muted)",
          opacity: canRemove ? 1 : 0.35,
        }}
        onMouseEnter={(e) => {
          if (canRemove) {
            e.currentTarget.style.backgroundColor = "var(--color-error-bg, rgba(239,68,68,0.08))";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <X className="w-[15px] h-[15px]" />
      </button>
    </div>
  );
}
