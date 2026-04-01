import { Header } from "../components/Header";
import { StickyFooter, FooterButton } from "../components/StickyFooter";
import { MultiSelectDropdown } from "../components/MultiSelectDropdown";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip";
import { useState } from "react";
import { ArrowLeft, Sparkles, FileText, ExternalLink, FolderSearch, Loader2, CheckCircle2, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ScopeLayoutProps, SourceDocument } from "../types/ScopeLayoutProps";

const STATUS_MESSAGES_COUNT = 7;

export function ScopeLayout1(props: ScopeLayoutProps) {
  const { t } = useTranslation();
  const {
    selectedRegions,
    selectedRigTypes,
    selectedActivities,
    selectedDocuments,
    documents,
    onRegionChange,
    onRigTypeChange,
    onActivitiesChange,
    onDocumentSelect,
    onToggleAllDocuments,
    onClearSelection,
    onProceed,
    onBack,
    isGenerating,
    progress,
    statusIndex,
    isSuccess,
    layoutSwitcher
  } = props;

  const hpSelectedCount = selectedDocuments.hp.length;
  const kcadSelectedCount = selectedDocuments.kcad.length;
  const totalSelectedCount = hpSelectedCount + kcadSelectedCount;
  
  // We need flat array of selected IDs for DocumentColumn
  const selectedDocs = [...selectedDocuments.hp, ...selectedDocuments.kcad];

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-page)", fontFamily: "Inter, sans-serif" }}
    >
      <Header breadcrumb={t("scope.title")} showOnlineStatus={true} showUser={true} layoutSwitcher={layoutSwitcher} />

      <main className="flex-1 w-full px-[24px] flex flex-col pb-5 mt-2 min-h-0">
        {/* Title row */}
        <div className="flex items-center justify-between mt-8 mb-[6px]">
          <h1 className="text-[14px] font-bold text-[var(--text-primary)] uppercase tracking-wide">
            {t("scope.title")}
          </h1>
        </div>

        {/* ── Single Scope Container ── */}
        <div className="bg-[var(--bg-card)] rounded-[8px] shadow-sm shrink-0" style={{ border: "var(--border-default)" }}>

          {/* Dropdowns Section */}
          <div className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <MultiSelectDropdown
                label={t("scope.region")}
                values={selectedRegions}
                onChange={onRegionChange}
                options={[
                  { value: "algeria", label: "Algeria" },
                  { value: "australia", label: "Australia" },
                  { value: "azerbaijan", label: "Azerbaijan" },
                  { value: "canada", label: "Canada" },
                  { value: "europe", label: "Europe" },
                  { value: "european-union", label: "European Union" },
                  { value: "germany", label: "Germany" },
                  { value: "iraq", label: "Iraq" },
                  { value: "kuwait", label: "Kuwait" },
                  { value: "netherlands", label: "Netherlands" },
                  { value: "oman", label: "Oman" },
                  { value: "pakistan", label: "Pakistan" },
                  { value: "russia", label: "Russia" },
                  { value: "saudi-arabia", label: "Saudi Arabia" },
                  { value: "united-kingdom", label: "United Kingdom" },
                  { value: "united-states", label: "United States" },
                ]}
                placeholder={t("scope.selectRegions")}
              />

              <MultiSelectDropdown
                label={t("scope.rigType")}
                values={selectedRigTypes}
                onChange={onRigTypeChange}
                options={[
                  { value: "land-rig", label: "Land Rig" },
                  { value: "offshore-rig", label: "Offshore Rig" },
                  { value: "workover-rig", label: "Workover Rig" },
                  { value: "drilling-rig", label: "Drilling Rig" },
                  { value: "completion-rig", label: "Completion Rig" },
                  { value: "coiled-tubing-rig", label: "Coiled Tubing Rig" },
                  { value: "snubbing-unit", label: "Snubbing Unit" },
                ]}
                placeholder={t("scope.selectRigTypes")}
              />

              <MultiSelectDropdown
                label={t("scope.filterByActivity")}
                values={selectedActivities}
                onChange={onActivitiesChange}
                options={[
                  { value: "life-critical", label: "Life-Critical Controls" },
                  { value: "hse-governance", label: "HSE Governance" },
                  { value: "drilling-ops", label: "Drilling Operations" },
                  { value: "well-control", label: "Well Control" },
                  { value: "pipe-tubular", label: "Pipe & Tubular Handling" },
                  { value: "mud-solids", label: "Mud System & Solids Control" },
                  { value: "pressure-drilling-line", label: "Pressure Systems & Drilling Line" },
                  { value: "rig-move", label: "Rig Move & Structural" },
                  { value: "lifting-hoisting", label: "Lifting & Hoisting" },
                  { value: "tools-equipment", label: "Tools & Equipment" },
                  { value: "maintenance-electrical", label: "Maintenance & Electrical" },
                  { value: "non-drilling", label: "Non-Drilling Operations" },
                  { value: "emergency-response", label: "Emergency Response" },
                  { value: "environmental-logistics", label: "Environmental & Logistics" },
                  { value: "loto", label: "LOTO" },
                ]}
                placeholder={t("scope.selectActivities", "Select activities...")}
              />
            </div>
          </div>

        </div>

        {/* ══════ Source Documents Section ══════ */}
        <div className="flex flex-col gap-1 mt-8 mb-4 shrink-0">
          <h2 className="text-[14px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--text-secondary)" }}>
            {t("scope.sourceDocuments")}
          </h2>
          <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
            {t("scope.sourceDocumentsSubtitle")}
          </p>
        </div>

        {/* Two Column Document Library */}
        <div className="grid grid-cols-2 gap-5 flex-1 min-h-0 overflow-hidden" style={{ gridTemplateRows: "1fr" }}>
          {/* ── H&P Column ── */}
          <DocumentColumn
            origin="H&P"
            docs={documents.hp}
            selectedDocs={selectedDocs}
            onToggleDoc={onDocumentSelect}
            onToggleAll={() => onToggleAllDocuments("H&P", documents.hp)}
          />

          {/* ── KCAD Column ── */}
          <DocumentColumn
            origin="KCAD"
            docs={documents.kcad}
            selectedDocs={selectedDocs}
            onToggleDoc={onDocumentSelect}
            onToggleAll={() => onToggleAllDocuments("KCAD", documents.kcad)}
          />
        </div>
      </main>

      {/* Selection Summary Bar */}
      <div 
        className="fixed bottom-[80px] left-[50%] z-40 transition-all duration-200 ease-out"
        style={{ 
          transform: totalSelectedCount > 0 ? "translate(-50%, 0)" : "translate(-50%, 150%)",
          opacity: totalSelectedCount > 0 ? 1 : 0,
          pointerEvents: totalSelectedCount > 0 ? "auto" : "none"
        }}
      >
        <div className="bg-[var(--bg-card)] shadow-[0_4px_24px_rgba(0,0,0,0.12)] rounded-full px-6 py-2.5 flex items-center gap-6 text-[13px] font-medium" style={{ border: "1px solid var(--border-default)" }}>
          <span style={{ color: "var(--text-primary)" }}>
            {t("scope.documentsSelected", { count: totalSelectedCount, hp: hpSelectedCount, kcad: kcadSelectedCount })}
          </span>
          <button 
            onClick={onClearSelection}
            className="text-[var(--color-brand)] font-semibold hover:underline bg-transparent border-none cursor-pointer p-0"
          >
            {t("scope.clearSelection")}
          </button>
        </div>
      </div>

      <StickyFooter justify="between">
        <FooterButton
          label={t("common.back")}
          icon={<ArrowLeft className="w-[14px] h-[14px]" />}
          variant="secondary"
          onClick={onBack}
        />
        <FooterButton
          label={totalSelectedCount > 0 ? t("scope.proceedSelected", { count: totalSelectedCount }) : t("common.proceed")}
          icon={<Sparkles className="w-[14px] h-[14px]" />}
          variant="primary"
          onClick={onProceed}
        />
      </StickyFooter>

      {/* AI Generation Modal Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-200" style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)" }}>
          <div className="bg-[var(--bg-card)] rounded-[12px] shadow-xl w-[480px] p-8 flex flex-col items-center text-center" style={{ border: "1px solid var(--border-default)" }}>
            
            {/* Icon Container */}
            <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center mb-5 transition-colors duration-300" style={{ backgroundColor: isSuccess ? "rgba(16,185,129,0.1)" : "rgba(43,85,151,0.1)" }}>
              {isSuccess ? (
                <CheckCircle2 className="w-[24px] h-[24px]" style={{ color: "#10b981" }} />
              ) : (
                <Loader2 className="w-[24px] h-[24px] animate-spin" style={{ color: "var(--color-brand)" }} />
              )}
            </div>

            {/* Title */}
            <h2 className="text-[18px] font-bold mb-2 transition-colors duration-300" style={{ color: "var(--text-primary)" }}>
              {isSuccess ? t("scope.modal.ready") : t("scope.modal.consolidating")}
            </h2>

            {/* Subtitle */}
            <p className="text-[14px] leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>
              {t("scope.modal.subtitle")}
            </p>

            {/* Rotating Status */}
            <div className="h-[20px] mb-4 w-full relative flex items-center justify-center overflow-hidden">
              {Array.from({ length: STATUS_MESSAGES_COUNT }).map((_, idx) => (
                <span
                  key={idx}
                  className="absolute text-[13px] font-medium"
                  style={{ 
                    color: "var(--text-secondary)",
                    opacity: idx === statusIndex && !isSuccess ? 1 : 0,
                    transform: idx === statusIndex && !isSuccess ? "translateY(0)" : "translateY(4px)",
                    transition: "opacity 300ms ease, transform 300ms ease"
                  }}
                >
                  {t(`scope.modal.status${idx}`)}
                </span>
              ))}
            </div>

            {/* Progress Bar Container */}
            <div className="w-full flex items-center gap-3" style={{ opacity: isSuccess ? 0 : 1, transition: "opacity 300ms ease" }}>
              <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-surface-4, rgba(255,255,255,0.1))" }}>
                <div 
                  className="h-full rounded-full transition-all ease-linear"
                  style={{ 
                    backgroundColor: "var(--color-brand)",
                    width: `${progress}%`,
                    transitionDuration: "50ms"
                  }}
                />
              </div>
              <span className="text-[13px] font-bold min-w-[36px] text-right" style={{ color: "var(--color-brand)" }}>
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* ── Document Column Component ── */
function DocumentColumn({
  origin,
  docs,
  selectedDocs,
  onToggleDoc,
  onToggleAll,
}: {
  origin: "H&P" | "KCAD";
  docs: SourceDocument[];
  selectedDocs: string[];
  onToggleDoc: (id: string) => void;
  onToggleAll: () => void;
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? docs.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.code.toLowerCase().includes(search.toLowerCase())
      )
    : docs;

  const columnSelectedCount = docs.filter(d => selectedDocs.includes(d.id)).length;
  const allSelected = docs.length > 0 && columnSelectedCount === docs.length;
  const isIndeterminate = columnSelectedCount > 0 && columnSelectedCount < docs.length;

  return (
    <div className="flex flex-col gap-2 h-full min-h-0 overflow-hidden">
      {/* Title above table */}
      <h3 className="text-[13px] font-bold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
        {origin === "H&P" ? t("scope.column.hpDocuments") : t("scope.column.kcadDocuments")}
      </h3>

      {/* Search bar */}
      <div style={{ position: "relative" }}>
        <Search
          className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: 10, width: 13, height: 13, color: "var(--text-muted)" }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documents..."
          style={{
            width: "100%",
            paddingLeft: 30,
            paddingRight: 12,
            paddingTop: 7,
            paddingBottom: 7,
            fontSize: 13,
            fontFamily: "Inter, sans-serif",
            borderRadius: 6,
            backgroundColor: "var(--color-surface-2)",
            border: "1px solid var(--color-surface-5)",
            color: "var(--color-text-primary)",
            outline: "none",
          }}
        />
      </div>

      {/* Card */}
      <div
        className="rounded-[10px] flex flex-col overflow-hidden flex-1 min-h-0"
        style={{ backgroundColor: "var(--bg-card)", border: "var(--border-default)" }}
      >
        {/* Column Header */}
        <div
          className="flex items-center gap-3 px-5 py-3.5"
          style={{ borderBottom: "var(--border-default)" }}
        >
          <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={allSelected ? true : isIndeterminate ? "indeterminate" : false}
              onCheckedChange={onToggleAll}
              className="data-[state=checked]:bg-[var(--color-brand)] data-[state=checked]:border-[var(--color-brand)] data-[state=indeterminate]:bg-[var(--color-brand)] data-[state=indeterminate]:border-[var(--color-brand)]"
            />
          </div>
          <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
            Document Name
          </span>
          <span className="text-[12px] font-medium ml-auto" style={{ color: "var(--text-muted)" }}>
            ({filtered.length})
          </span>
        </div>

      {/* Document List */}
      <div className="flex flex-col overflow-y-auto flex-1 min-h-0">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 px-6">
            <FolderSearch className="w-[28px] h-[28px]" style={{ color: "var(--text-muted)", opacity: 0.4 }} />
            <p className="text-[13px] text-center" style={{ color: "var(--text-muted)" }}>
              {search.trim() ? "No documents match your search." : t("scope.noDocuments", { origin })}
            </p>
          </div>
        ) : (
          filtered.map((doc) => {
            const isSelected = selectedDocs.includes(doc.id);
            return (
              <div
                key={doc.id}
                onClick={() => onToggleDoc(doc.id)}
                className="flex items-center gap-3 px-5 py-3 cursor-pointer group"
                style={{
                  borderBottom: "var(--border-subtle)",
                  backgroundColor: isSelected ? "rgba(43,85,151,0.06)" : "transparent",
                  transition: "background-color 150ms ease-in, opacity 200ms ease-out, max-height 200ms ease-out",
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                {/* Checkbox */}
                <div onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleDoc(doc.id)}
                    className="data-[state=checked]:bg-[var(--color-brand)] data-[state=checked]:border-[var(--color-brand)]"
                  />
                </div>

                {/* Icon */}
                <div
                  className="w-[32px] h-[32px] rounded-[6px] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: isSelected ? "transparent" : "var(--bg-hover)" }}
                >
                  <FileText className="w-[16px] h-[16px]" style={{ color: isSelected ? "var(--color-brand)" : "var(--text-muted)" }} />
                </div>

                {/* Info */}
                <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                  <span className="text-[13px] font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                    {doc.code.split("-")[0]} {doc.code.split("-")[1]} — {doc.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                      {doc.code} · {doc.revision}
                    </span>
                    <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                      · {doc.lastUpdated}
                    </span>
                  </div>
                </div>

                {/* Activity Tags */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {doc.activities.slice(0, 3).map(actId => {
                    const actName = t(`scope.activities.${actId}`);
                    return (
                      <Badge
                        key={actId}
                        variant="secondary"
                        className="text-[10px] font-semibold px-2 py-0.5"
                        style={{
                          backgroundColor: "var(--bg-hover)",
                          color: "var(--text-secondary)",
                          border: "1px solid var(--border-default)",
                        }}
                      >
                        {actName}
                      </Badge>
                    );
                  })}
                  {doc.activities.length > 3 && (
                    <span className="text-[11px] font-medium ml-0.5" style={{ color: "var(--text-muted)" }}>
                      +{doc.activities.length - 3}
                    </span>
                  )}
                </div>

                {/* View Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center shrink-0 rounded-[5px] w-[28px] h-[28px]"
                      style={{ color: "var(--color-brand)", backgroundColor: "rgba(43,85,151,0.08)" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-[13px] h-[13px]" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top">View document in new tab</TooltipContent>
                </Tooltip>
              </div>
            );
          })
        )}
      </div>
      </div>
    </div>
  );
}
