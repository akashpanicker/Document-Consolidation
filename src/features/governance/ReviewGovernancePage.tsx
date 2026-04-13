import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, ChevronDown } from "lucide-react";
import { Header } from "../../components/shared/AppHeader";
import { StickyFooter, FooterButton } from "../../components/shared/StickyFooter";
import { toast } from "sonner";
import { Toaster } from "../../components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { REGIONS } from "../new-consolidation/data/regions";
import { GovernanceStage, GovernanceUser } from "./governance.types";
import { StageRow } from "./components/StageRow";
import { StepperPreview } from "./components/StepperPreview";
import { RegionNavItem } from "./components/RegionNavItem";
import { CopyFromRegionDropdown } from "./components/CopyFromRegionDropdown";

/* ── Available reviewers ──────────────────────────────────────── */

const USERS: GovernanceUser[] = [
  { id: "john-doe", name: "John Doe", role: "Rig Manager" },
  { id: "marcos-de-almeida", name: "Marcos de Almeida", role: "Sr. QHSE Manager" },
  { id: "sarah-smith", name: "Sarah Smith", role: "HSE Director" },
  { id: "lloyd-baxter", name: "Lloyd Baxter", role: "Operations Manager" },
  { id: "adrian-franco", name: "Adrian Franco", role: "Drilling Supervisor" },
];

/* ── Pre-populated mock governance data ──────────────────────── */

const DEFAULT_GOVERNANCE: Record<string, GovernanceStage[]> = {
  "united-states": [
    { id: "us-1", stageNumber: 1, userId: "john-doe", userName: "John Doe", userRole: "Rig Manager" },
    { id: "us-2", stageNumber: 2, userId: "sarah-smith", userName: "Sarah Smith", userRole: "HSE Director" },
    { id: "us-3", stageNumber: 3, userId: "lloyd-baxter", userName: "Lloyd Baxter", userRole: "Operations Manager" },
  ],
  "saudi-arabia": [
    { id: "sa-1", stageNumber: 1, userId: "marcos-de-almeida", userName: "Marcos de Almeida", userRole: "Sr. QHSE Manager" },
    { id: "sa-2", stageNumber: 2, userId: "adrian-franco", userName: "Adrian Franco", userRole: "Drilling Supervisor" },
  ],
  "united-kingdom": [
    { id: "uk-1", stageNumber: 1, userId: "sarah-smith", userName: "Sarah Smith", userRole: "HSE Director" },
    { id: "uk-2", stageNumber: 2, userId: "john-doe", userName: "John Doe", userRole: "Rig Manager" },
    { id: "uk-3", stageNumber: 3, userId: "marcos-de-almeida", userName: "Marcos de Almeida", userRole: "Sr. QHSE Manager" },
  ],
};

const STORAGE_KEY_PREFIX = "hp_doc_governance_";

function loadStages(regionId: string): GovernanceStage[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${regionId}`);
    if (raw) return JSON.parse(raw) as GovernanceStage[];
  } catch { /* ignore */ }
  return DEFAULT_GOVERNANCE[regionId] ?? [
    { id: `${regionId}-1`, stageNumber: 1, userId: "", userName: "", userRole: "" },
  ];
}

/** Returns the stages last written to localStorage, or null if never saved. */
function loadSavedStages(regionId: string): GovernanceStage[] | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${regionId}`);
    if (raw) return JSON.parse(raw) as GovernanceStage[];
  } catch { /* ignore */ }
  return null;
}

function persistStages(regionId: string, stages: GovernanceStage[]) {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${regionId}`, JSON.stringify(stages));
}

/* ── Component ────────────────────────────────────────────────── */

export function ReviewGovernancePage() {
  const navigate = useNavigate();

  /* Working state — edited but possibly not saved */
  const [selectedRegionId, setSelectedRegionId] = useState<string>(REGIONS[0].value);
  const [stagesByRegion, setStagesByRegion] = useState<Record<string, GovernanceStage[]>>(() => {
    const init: Record<string, GovernanceStage[]> = {};
    REGIONS.forEach(r => { init[r.value] = loadStages(r.value); });
    return init;
  });

  /* Saved state — mirrors localStorage; null means never explicitly saved */
  const [savedByRegion, setSavedByRegion] = useState<Record<string, GovernanceStage[] | null>>(() => {
    const init: Record<string, GovernanceStage[] | null> = {};
    REGIONS.forEach(r => { init[r.value] = loadSavedStages(r.value); });
    return init;
  });

  /* Feature 2 — unsaved-changes dialog */
  const [pendingRegionId, setPendingRegionId] = useState<string | null>(null);

  /* Feature 3 — copy-from dropdown */
  const [copyFromOpen, setCopyFromOpen] = useState(false);
  const [copiedFromLabel, setCopiedFromLabel] = useState<string | null>(null);
  const copyBtnRef = useRef<HTMLDivElement>(null);

  /* ── Derived ── */
  const selectedRegion = REGIONS.find(r => r.value === selectedRegionId) ?? REGIONS[0];
  const stages = stagesByRegion[selectedRegionId] ?? [];

  const hasUnsavedChanges = (regionId: string, currentStages: GovernanceStage[]): boolean => {
    const saved = savedByRegion[regionId];
    if (saved === null) return true;
    return JSON.stringify(currentStages) !== JSON.stringify(saved);
  };

  const currentHasUnsaved = hasUnsavedChanges(selectedRegionId, stages);

  /* ── Helpers ── */
  const updateStages = (regionId: string, next: GovernanceStage[]) => {
    setStagesByRegion(prev => ({ ...prev, [regionId]: next }));
    setCopiedFromLabel(null);
  };

  const commitSave = (regionId: string, stagesToSave: GovernanceStage[]) => {
    persistStages(regionId, stagesToSave);
    setSavedByRegion(prev => ({ ...prev, [regionId]: stagesToSave }));
  };

  /* ── Handlers ── */
  const handleUserChange = (stageId: string, userId: string) => {
    const user = USERS.find(u => u.id === userId);
    if (!user) return;
    updateStages(selectedRegionId, stages.map(s =>
      s.id === stageId
        ? { ...s, userId: user.id, userName: user.name, userRole: user.role }
        : s,
    ));
  };

  const handleRemoveStage = (stageId: string) => {
    if (stages.length <= 1) return;
    const next = stages
      .filter(s => s.id !== stageId)
      .map((s, i) => ({ ...s, stageNumber: i + 1 }));
    updateStages(selectedRegionId, next);
  };

  const handleAddStage = () => {
    const newStage: GovernanceStage = {
      id: `${selectedRegionId}-${Date.now()}`,
      stageNumber: stages.length + 1,
      userId: "", userName: "", userRole: "",
    };
    updateStages(selectedRegionId, [...stages, newStage]);
  };

  const handleSave = () => {
    commitSave(selectedRegionId, stages);
    setCopiedFromLabel(null);
    toast(`Reviewer chain saved for ${selectedRegion.label}`);
  };

  /* Feature 2 — region navigation with unsaved-changes guard */
  const handleRegionClick = (regionId: string) => {
    if (regionId === selectedRegionId) return;
    if (currentHasUnsaved) {
      setPendingRegionId(regionId);
    } else {
      setSelectedRegionId(regionId);
      setCopiedFromLabel(null);
    }
  };

  const handleSaveAndSwitch = () => {
    commitSave(selectedRegionId, stages);
    toast(`Reviewer chain saved for ${selectedRegion.label}`);
    setSelectedRegionId(pendingRegionId!);
    setPendingRegionId(null);
    setCopiedFromLabel(null);
  };

  const handleDiscardAndSwitch = () => {
    // Reload from localStorage/default for the current region
    setStagesByRegion(prev => ({ ...prev, [selectedRegionId]: loadStages(selectedRegionId) }));
    setSelectedRegionId(pendingRegionId!);
    setPendingRegionId(null);
    setCopiedFromLabel(null);
  };

  const handleCancelSwitch = () => {
    setPendingRegionId(null);
  };

  /* Feature 3 — copy from region */
  const handleCopyFrom = (sourceRegionId: string) => {
    const sourceStages = savedByRegion[sourceRegionId];
    if (!sourceStages) return;

    const copied: GovernanceStage[] = sourceStages.map((s, i) => ({
      ...s,
      id: `${selectedRegionId}-copy-${i}-${Date.now()}`,
    }));

    setStagesByRegion(prev => ({ ...prev, [selectedRegionId]: copied }));
    const sourceName = REGIONS.find(r => r.value === sourceRegionId)?.label ?? sourceRegionId;
    setCopiedFromLabel(sourceName);
    setCopyFromOpen(false);
  };

  /* Pending region name for dialog body */
  const pendingRegionName = REGIONS.find(r => r.value === pendingRegionId)?.label ?? "";

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-page)", fontFamily: "Inter, sans-serif" }}
    >
      <Header
        breadcrumb={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Review Governance" },
        ]}
        showUser={true}
      />

      {/* ═══ Two-Column Layout ═══ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left Panel: Region Navigation ── */}
        <div
          className="shrink-0 flex flex-col py-6 px-5 overflow-y-auto"
          style={{
            width: 220,
            borderRight: "var(--border-default)",
            backgroundColor: "var(--bg-card)",
          }}
        >
          <span
            className="mb-5"
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              color: "var(--text-muted)",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Regions
          </span>

          <nav className="flex flex-col gap-0.5">
            {REGIONS.map(region => (
              <RegionNavItem
                key={region.value}
                regionName={region.label}
                isActive={region.value === selectedRegionId}
                isConfigured={savedByRegion[region.value] !== null}
                onClick={() => handleRegionClick(region.value)}
              />
            ))}
          </nav>
        </div>

        {/* ── Center Content ── */}
        <div className="flex-1 flex flex-col overflow-y-auto px-8 py-8 pb-24">

          {/* Page header */}
          <div className="mb-6">
            <h1
              className="text-[18px] font-bold uppercase tracking-wide mb-1"
              style={{ color: "var(--text-secondary)", fontFamily: "Inter, sans-serif" }}
            >
              Review Governance
            </h1>
            <p
              className="text-[13px]"
              style={{ color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}
            >
              Configure reviewer chains by region
            </p>
          </div>

          {/* ── Reviewer chain card — full width ── */}
          <div
            className="w-full rounded-[8px]"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "var(--border-default)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {/* Feature 1 — Live stepper preview */}
            <div className="px-6 py-5">
              <span
                className="mb-4 block"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  color: "var(--text-muted)",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Preview
              </span>
              <StepperPreview stages={stages} />
            </div>

            {/* Card header — section heading + copy button */}
            <div
              className="px-6 pt-5 pb-2 flex items-center justify-between"
              style={{ borderTop: "var(--border-default)" }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  color: "var(--text-muted)",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Reviewer Chain for {selectedRegion.label}
              </span>

              {/* Feature 3 — Copy from region trigger */}
              <div ref={copyBtnRef} className="relative">
                <button
                  type="button"
                  onClick={() => setCopyFromOpen(prev => !prev)}
                  className="flex items-center gap-2"
                  style={{
                    backgroundColor: "var(--color-surface-2)",
                    border: `1px solid ${copyFromOpen ? "var(--color-brand)" : "var(--color-surface-5)"}`,
                    borderRadius: 4,
                    height: 32,
                    padding: "0 10px",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  Copy from region
                  <ChevronDown
                    size={14}
                    style={{
                      color: "var(--color-text-tertiary)",
                      transition: "transform 0.2s",
                      transform: copyFromOpen ? "rotate(180deg)" : "rotate(0deg)",
                      flexShrink: 0,
                    }}
                  />
                </button>

                {copyFromOpen && (
                  <CopyFromRegionDropdown
                    currentRegionId={selectedRegionId}
                    savedStagesByRegion={savedByRegion}
                    onSelect={handleCopyFrom}
                    onClose={() => setCopyFromOpen(false)}
                  />
                )}
              </div>
            </div>

            {/* Stage rows */}
            <div className="flex flex-col gap-4 px-6 pt-2 pb-5">
              {stages.map(stage => (
                <StageRow
                  key={stage.id}
                  stageNumber={stage.stageNumber}
                  selectedUser={stage.userId}
                  userOptions={USERS}
                  onUserChange={(userId) => handleUserChange(stage.id, userId)}
                  onRemove={() => handleRemoveStage(stage.id)}
                  canRemove={stages.length > 1}
                />
              ))}
            </div>

            {/* Add Stage button */}
            <div
              className="px-6 py-4"
              style={{ borderTop: "var(--border-default)" }}
            >
              <button
                type="button"
                onClick={handleAddStage}
                className="flex items-center gap-1.5"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "Inter, sans-serif",
                  color: "var(--color-brand)",
                  padding: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.75"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                <Plus className="w-[14px] h-[14px]" />
                Add Stage
              </button>
            </div>
          </div>

          {/* Feature 3 — "Copied from" info line */}
          {copiedFromLabel && (
            <p
              className="mt-3 text-[12px]"
              style={{ color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}
            >
              Copied from {copiedFromLabel} — review and save to apply
            </p>
          )}
        </div>
      </div>

      {/* ── Sticky Bottom Bar ── */}
      <StickyFooter justify="between">
        <FooterButton
          label="Back"
          icon={<ArrowLeft className="w-[14px] h-[14px]" />}
          variant="secondary"
          onClick={() => navigate("/dashboard")}
        />
        <FooterButton
          label="Save Governance Settings"
          variant="primary"
          onClick={handleSave}
        />
      </StickyFooter>

      {/* ── Feature 2 — Unsaved Changes Dialog ── */}
      <Dialog
        open={pendingRegionId !== null}
        onOpenChange={(open) => { if (!open) handleCancelSwitch(); }}
      >
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes for{" "}
              <strong>{selectedRegion.label}</strong>. Do you want to save
              before switching?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2 sm:justify-end">
            {/* Cancel — far left on desktop via order */}
            <button
              type="button"
              onClick={handleCancelSwitch}
              className="text-[13px] font-medium px-4 h-9 rounded-[6px] transition-colors order-last sm:order-first"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              Cancel
            </button>

            {/* Discard and Switch */}
            <button
              type="button"
              onClick={handleDiscardAndSwitch}
              className="text-[13px] font-semibold px-4 h-9 rounded-[6px] transition-colors whitespace-nowrap shrink-0"
              style={{
                background: "none",
                border: "var(--border-default)",
                cursor: "pointer",
                color: "var(--text-secondary)",
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              Discard and Switch
            </button>

            {/* Save and Switch — primary */}
            <button
              type="button"
              onClick={handleSaveAndSwitch}
              className="text-[13px] font-semibold px-4 h-9 rounded-[6px] transition-colors whitespace-nowrap shrink-0"
              style={{
                backgroundColor: "var(--color-brand)",
                border: "none",
                cursor: "pointer",
                color: "var(--text-on-primary)",
                fontFamily: "Inter, sans-serif",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--color-brand-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--color-brand)"; }}
            >
              Save and Switch to {pendingRegionName}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster position="top-center" />
    </div>
  );
}
