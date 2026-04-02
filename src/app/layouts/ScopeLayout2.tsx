import { Header } from "../components/Header";
import { StickyFooter, FooterButton } from "../components/StickyFooter";
import { SearchableSelect } from "../components/SearchableSelect";
import { MultiSelectDropdown } from "../components/MultiSelectDropdown";
import { Checkbox } from "../components/ui/checkbox";
import { Tooltip, TooltipTrigger, TooltipContent } from "../components/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import { useState } from "react";
import { ArrowLeft, Sparkles, ExternalLink, FolderSearch, Loader2, CheckCircle2, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ScopeLayoutProps, SourceDocument } from "../types/ScopeLayoutProps";

const STATUS_MESSAGES_COUNT = 7;

export function ScopeLayout2(props: ScopeLayoutProps) {
  const { t } = useTranslation();
  const {
    selectedRegions,
    selectedRigTypes,
    selectedActivities,
    selectedDocuments,
    documents,
    activities,
    onRegionChange,
    onRigTypeChange,
    onActivityChange,
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
      {/* Header should probably be managed by Page or we can render it here. The prompt says "Add a layout switcher icon button to the Scope screen header". So Header is rendered here. 
          Actually wait, if Header is in layout, then state for switcher needs to be passed down. But orchestrator ScopePage can pass header? Let's just render inner main content?
          Wait, existing UI has Header inside ScopeScreen.tsx. I'll keep it here, or we can move Header to ScopePage. 
          Prompt says: "Add a layout switcher... placed immediately left of the dark/light mode toggle". I will modify Header directly.
      */}
      <Header breadcrumb={t("scope.title")} showOnlineStatus={true} showUser={true} layoutSwitcher={layoutSwitcher} />

      <main className="flex-1 w-full px-[24px] flex flex-col pb-5 mt-2 overflow-y-auto">
        {/* Title row */}
        <div className="flex items-center justify-between mt-8 mb-[6px]">
          <h1 className="text-[14px] font-bold text-[var(--text-primary)] uppercase tracking-wide">
            {t("scope.title")}
          </h1>
        </div>

        {/* ── Single Scope Container ── */}
        <div className="bg-[var(--bg-card)] rounded-[8px] shadow-sm" style={{ border: "var(--border-default)" }}>

          {/* Dropdowns Section */}
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
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
            </div>
          </div>

          {/* Separator */}
          <div className="mx-6" style={{ height: 1, backgroundColor: "var(--color-surface-3, var(--bg-hover))" }} />

          {/* Filter by Activity Section */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[14px] font-bold text-[var(--text-secondary)] uppercase tracking-wide">{t("scope.filterByActivity")}</h2>
              <span className="text-[12px] font-normal" style={{ color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}>Optional</span>
            </div>
            <div className="grid grid-cols-8 gap-3">
              {activities.map(activity => {
                const isSelected = selectedActivities.includes(activity.id);
                return (
                  <div
                    key={activity.id}
                    onClick={() => onActivityChange(activity.id)}
                    className="flex flex-col cursor-pointer rounded-[8px] overflow-hidden"
                    style={{
                      border: isSelected ? "2px solid var(--color-brand)" : "1px solid var(--color-surface-5, rgba(255,255,255,0.08))",
                      backgroundColor: isSelected ? "rgba(43,85,151,0.05)" : "var(--bg-card)",
                      transition: "all 150ms ease-in-out",
                    }}
                  >
                    {/* Image */}
                    <div
                      className="relative overflow-hidden"
                      style={{ height: 90 }}
                    >
                      <img
                        src={activity.image}
                        alt={activity.name}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-150"
                      />
                      {isSelected && (
                        <div
                          className="absolute inset-0"
                          style={{
                            background: "linear-gradient(180deg, rgba(43,85,151,0.1) 0%, rgba(43,85,151,0.25) 100%)",
                          }}
                        />
                      )}
                    </div>
                    {/* Text below image */}
                    <div className="px-2.5 py-2" style={{ borderTop: "1px solid var(--color-surface-5, rgba(255,255,255,0.08))" }}>
                      <span
                        className="text-[12px] font-semibold leading-tight"
                        style={{
                          color: isSelected ? "var(--color-brand)" : "var(--text-secondary)",
                          transition: "color 150ms ease-in-out",
                        }}
                      >
                        {t(`scope.activities.${activity.id}`, activity.name)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ══════ Source Documents Section ══════ */}
        <div className="flex flex-col gap-1 mt-8 mb-4">
          <h2 className="text-[14px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--text-secondary)" }}>
            {t("scope.sourceDocuments")}
          </h2>
          <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
            {t("scope.sourceDocumentsSubtitle")}
          </p>
        </div>

        {/* Two Column Document Library */}
        <div className="grid grid-cols-2 gap-5">
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

/* ── Doc type badge ── */
const DOC_TYPE_MAP: Record<string, { label: string; bg: string; color: string }> = {
  "Procedure": { label: "Procedure", bg: "rgba(16,185,129,0.12)", color: "#10b981" },
  "Policy":    { label: "Policy",    bg: "rgba(139,92,246,0.12)", color: "#8b5cf6" },
  "Standard":  { label: "Standard",  bg: "rgba(43,85,151,0.12)",  color: "var(--color-brand)" },
  "Checklist": { label: "Checklist", bg: "rgba(245,158,11,0.12)", color: "#f59e0b" },
};
function docType(category: string) {
  return DOC_TYPE_MAP[category] ?? { label: "Standard", bg: "rgba(43,85,151,0.12)", color: "var(--color-brand)" };
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

  const W = { cb: 40, type: 100, action: 40 };
  const hdrCell: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
    color: "var(--color-text-tertiary, var(--text-muted))", fontFamily: "Inter, sans-serif",
    whiteSpace: "nowrap", flexShrink: 0,
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Title */}
      <h3 className="text-[13px] font-bold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
        {origin === "H&P" ? t("scope.column.hpDocuments") : t("scope.column.kcadDocuments")}
      </h3>

      {/* Search */}
      <div style={{ position: "relative" }}>
        <Search className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: 10, width: 13, height: 13, color: "var(--text-muted)" }} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documents..."
          style={{
            width: "100%", paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
            fontSize: 13, fontFamily: "Inter, sans-serif", borderRadius: 6,
            backgroundColor: "var(--color-surface-2)", border: "1px solid var(--color-surface-5)",
            color: "var(--color-text-primary)", outline: "none",
          }} />
      </div>

      {/* Card */}
      <div className="rounded-[10px] flex flex-col overflow-hidden"
        style={{ backgroundColor: "var(--bg-card)", border: "var(--border-default)" }}>

        {/* Header row */}
        <div className="flex items-center px-3 shrink-0"
          style={{ height: 40, borderBottom: "var(--border-default)", backgroundColor: "var(--color-surface-1, var(--bg-hover))" }}>
          <div style={{ width: W.cb, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={allSelected ? true : isIndeterminate ? "indeterminate" : false}
              onCheckedChange={onToggleAll}
              className="data-[state=checked]:bg-[var(--color-brand)] data-[state=checked]:border-[var(--color-brand)] data-[state=indeterminate]:bg-[var(--color-brand)] data-[state=indeterminate]:border-[var(--color-brand)]"
            />
          </div>
          <div style={{ width: 300, flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={hdrCell}>Document Name</span>
            <span style={{ ...hdrCell, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>({filtered.length})</span>
          </div>
          <div style={{ width: W.type, flexShrink: 0, paddingLeft: 8 }}><span style={hdrCell}>Type</span></div>
          <div style={{ flex: 1, minWidth: 0, paddingLeft: 8 }}><span style={hdrCell}>Activities</span></div>
          <div style={{ width: W.action, flexShrink: 0 }} />
        </div>

        {/* Rows */}
        <div className="flex flex-col overflow-y-auto" style={{ maxHeight: 6 * 52 }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 px-6">
              <FolderSearch className="w-[28px] h-[28px]" style={{ color: "var(--text-muted)", opacity: 0.4 }} />
              <p className="text-[13px] text-center" style={{ color: "var(--text-muted)" }}>
                {search.trim() ? "No documents match your search." : t("scope.noDocuments", { origin })}
              </p>
            </div>
          ) : filtered.map((doc) => {
            const isSelected = selectedDocs.includes(doc.id);
            const type = docType(doc.category);
            const visibleActs = doc.activities.slice(0, 3);
            const overflowActs = doc.activities.slice(3);
            return (
              <div key={doc.id} onClick={() => onToggleDoc(doc.id)}
                className="flex items-center px-3 cursor-pointer"
                style={{
                  height: 52, flexShrink: 0, borderBottom: "var(--border-subtle)",
                  backgroundColor: isSelected ? "rgba(43,85,151,0.06)" : "transparent",
                  transition: "background-color 150ms ease-in",
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"; }}>

                {/* Col 1 — Checkbox */}
                <div style={{ width: W.cb, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                  onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={isSelected} onCheckedChange={() => onToggleDoc(doc.id)}
                    className="data-[state=checked]:bg-[var(--color-brand)] data-[state=checked]:border-[var(--color-brand)]" />
                </div>

                {/* Col 2 — Doc info */}
                <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", fontFamily: "Inter, sans-serif",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>
                    {doc.name}
                    {doc.hasMsBadge && (
                      <span style={{ 
                        fontSize: 8.5, fontWeight: 800, padding: "0 3px", borderRadius: 2, 
                        backgroundColor: "var(--color-brand)", color: "#fff", marginLeft: 6,
                        flexShrink: 0, height: 14, display: "flex", alignItems: "center"
                      }}>MS</span>
                    )}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "Inter, sans-serif",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {doc.code} · {doc.revision} · {doc.lastUpdated}
                  </span>
                </div>

                {/* Col 3 — Type badge */}
                <div style={{ width: W.type, flexShrink: 0, paddingLeft: 8 }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center",
                    fontSize: 11, fontWeight: 600, fontFamily: "Inter, sans-serif",
                    padding: "2px 8px", borderRadius: 4,
                    backgroundColor: type.bg, color: type.color, whiteSpace: "nowrap",
                  }}>
                    {type.label}
                  </span>
                </div>

                {/* Col 4 — Category tags */}
                <div style={{ flex: 1, minWidth: 0, paddingLeft: 8, display: "flex", alignItems: "center", gap: 4, overflow: "hidden" }}>
                  {visibleActs.map(actId => (
                    <span key={actId} style={{
                      display: "inline-flex", alignItems: "center", whiteSpace: "nowrap",
                      fontSize: 11, fontWeight: 600, fontFamily: "Inter, sans-serif",
                      padding: "2px 6px", borderRadius: 4,
                      backgroundColor: "var(--bg-hover)", color: "var(--text-secondary)",
                      border: "1px solid var(--border-default)",
                    }}>
                      {t(`scope.activities.${actId}`, actId)}
                    </span>
                  ))}
                  {overflowActs.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", cursor: "pointer", whiteSpace: "nowrap",
                          fontSize: 10, fontWeight: 600, fontFamily: "Inter, sans-serif",
                          padding: "2px 6px", borderRadius: 4, flexShrink: 0,
                          backgroundColor: "var(--bg-hover)", color: "var(--text-muted)",
                          border: "1px solid var(--border-default)",
                        }}>
                          +{overflowActs.length}
                        </span>
                      </PopoverTrigger>
                      <PopoverContent side="top" style={{ padding: "10px 12px", width: "auto", maxWidth: 240 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          {overflowActs.map(actId => (
                            <span key={actId} style={{ fontSize: 12, fontFamily: "Inter, sans-serif", color: "var(--text-primary)" }}>
                              {t(`scope.activities.${actId}`, actId)}
                            </span>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                {/* Col 5 — View */}
                <div style={{ width: W.action, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center rounded-[5px] w-[28px] h-[28px]"
                        style={{ color: "var(--color-brand)", backgroundColor: "rgba(43,85,151,0.08)" }}
                        onClick={(e) => e.stopPropagation()}>
                        <ExternalLink className="w-[13px] h-[13px]" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent side="top">View document in new tab</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
