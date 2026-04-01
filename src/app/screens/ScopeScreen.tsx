import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { StickyFooter, FooterButton } from "../components/StickyFooter";
import { SearchableSelect } from "../components/SearchableSelect";
import { MultiSelectDropdown } from "../components/MultiSelectDropdown";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { MapPin, Info, ArrowLeft, Sparkles, FileText, ExternalLink, FolderSearch, Loader2, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const ACTIVITIES = [
  { id: "life-critical", name: "Life-Critical Controls", image: "/assets/site-conditions/inspection.png" },
  { id: "hse-governance", name: "HSE Governance", image: "/assets/site-conditions/normal.png" },
  { id: "drilling-ops", name: "Drilling Operations", image: "/assets/site-conditions/drilling.png" },
  { id: "well-control", name: "Well Control", image: "/assets/site-conditions/inspection.png" },
  { id: "pipe-tubular", name: "Pipe & Tubular Handling", image: "/assets/site-conditions/maintenance.png" },
  { id: "mud-solids", name: "Mud System & Solids Control", image: "/assets/site-conditions/muddy.png" },
  { id: "pressure-drilling-line", name: "Pressure Systems & Drilling Line", image: "/assets/site-conditions/drilling.png" },
  { id: "rig-move", name: "Rig Move & Structural", image: "/assets/site-conditions/normal.png" },
  { id: "lifting-hoisting", name: "Lifting & Hoisting", image: "/assets/site-conditions/inspection.png" },
  { id: "tools-equipment", name: "Tools & Equipment", image: "/assets/site-conditions/maintenance.png" },
  { id: "maintenance-electrical", name: "Maintenance & Electrical", image: "/assets/site-conditions/maintenance.png" },
  { id: "non-drilling", name: "Non-Drilling Operations", image: "/assets/site-conditions/normal.png" },
  { id: "emergency-response", name: "Emergency Response", image: "/assets/site-conditions/inspection.png" },
  { id: "environmental-logistics", name: "Environmental & Logistics", image: "/assets/site-conditions/wet-surfaces.png" },
  { id: "loto", name: "LOTO", image: "/assets/site-conditions/maintenance.png" },
];

const STATUS_MESSAGES_COUNT = 7;

/* ── Mock Document Data ── */
interface SourceDocument {
  id: string;
  origin: "H&P" | "KCAD";
  name: string;
  code: string;
  revision: string;
  category: string;
  activities: string[];   // matches ACTIVITIES ids
  lastUpdated: string;
  country: string;
  region: string;
  rig: string;
  url: string;
}

const SOURCE_DOCUMENTS: SourceDocument[] = [
  // ── H&P Documents ──
  { id: "hp-1", origin: "H&P", name: "Hot Work Procedure", code: "HSE-005", revision: "Rev. 06", category: "HSE", activities: ["life-critical", "hse-governance"], lastUpdated: "05 Jan 2025", country: "us", region: "united-states", rig: "rig-1", url: "https://example.com/hse-005" },
  { id: "hp-2", origin: "H&P", name: "H₂S Monitoring and Response", code: "HSE-012", revision: "Rev. 03", category: "HSE", activities: ["life-critical", "hse-governance", "emergency-response"], lastUpdated: "14 Mar 2024", country: "us", region: "united-states", rig: "rig-1", url: "https://example.com/hse-012" },
  { id: "hp-3", origin: "H&P", name: "Well Control Manual", code: "WC-001", revision: "Rev. 04", category: "Well Control", activities: ["well-control", "drilling-ops"], lastUpdated: "01 Nov 2024", country: "us", region: "united-states", rig: "rig-2", url: "https://example.com/wc-001" },
  { id: "hp-4", origin: "H&P", name: "Emergency Response Plan", code: "EM-003", revision: "Rev. 02", category: "Emergency Response", activities: ["emergency-response", "life-critical"], lastUpdated: "22 Aug 2024", country: "sa", region: "saudi-arabia", rig: "rig-3", url: "https://example.com/em-003" },
  { id: "hp-5", origin: "H&P", name: "Rig Floor Safety Procedures", code: "RM-007", revision: "Rev. 05", category: "Rig Management", activities: ["drilling-ops", "pipe-tubular", "tools-equipment"], lastUpdated: "10 Jun 2024", country: "kw", region: "kuwait", rig: "rig-3", url: "https://example.com/rm-007" },
  { id: "hp-6", origin: "H&P", name: "BOP Testing & Maintenance", code: "WC-004", revision: "Rev. 03", category: "Well Control", activities: ["well-control", "pressure-drilling-line", "maintenance-electrical"], lastUpdated: "28 Sep 2024", country: "ca", region: "canada", rig: "rig-1", url: "https://example.com/wc-004" },
  { id: "hp-7", origin: "H&P", name: "Confined Space Entry", code: "HSE-018", revision: "Rev. 02", category: "HSE", activities: ["life-critical", "loto", "non-drilling"], lastUpdated: "03 Feb 2025", country: "om", region: "oman", rig: "rig-2", url: "https://example.com/hse-018" },
  { id: "hp-8", origin: "H&P", name: "Crane Operations Manual", code: "RM-011", revision: "Rev. 04", category: "Rig Management", activities: ["lifting-hoisting", "rig-move"], lastUpdated: "19 Apr 2024", country: "uk", region: "united-kingdom", rig: "rig-1", url: "https://example.com/rm-011" },
  // ── KCAD Documents ──
  { id: "kc-1", origin: "KCAD", name: "Global HSE Standard", code: "KCAD-HSE-001", revision: "Rev. 08", category: "HSE", activities: ["hse-governance", "life-critical"], lastUpdated: "12 Dec 2024", country: "us", region: "united-states", rig: "rig-1", url: "https://example.com/kcad-hse-001" },
  { id: "kc-2", origin: "KCAD", name: "Environmental Compliance Guide", code: "KCAD-ENV-003", revision: "Rev. 05", category: "Environmental", activities: ["environmental-logistics", "hse-governance"], lastUpdated: "20 Nov 2024", country: "us", region: "united-states", rig: "rig-2", url: "https://example.com/kcad-env-003" },
  { id: "kc-3", origin: "KCAD", name: "Well Integrity Management", code: "KCAD-WI-002", revision: "Rev. 03", category: "Well Control", activities: ["well-control", "pressure-drilling-line"], lastUpdated: "15 Jul 2024", country: "sa", region: "saudi-arabia", rig: "rig-3", url: "https://example.com/kcad-wi-002" },
  { id: "kc-4", origin: "KCAD", name: "Emergency Equipment Requirements", code: "KCAD-EM-004", revision: "Rev. 06", category: "Emergency Response", activities: ["emergency-response", "tools-equipment"], lastUpdated: "01 Oct 2024", country: "ca", region: "canada", rig: "rig-1", url: "https://example.com/kcad-em-004" },
  { id: "kc-5", origin: "KCAD", name: "Personnel Safety Handbook", code: "KCAD-HSE-009", revision: "Rev. 04", category: "HSE", activities: ["hse-governance", "life-critical", "loto"], lastUpdated: "08 May 2024", country: "om", region: "oman", rig: "rig-2", url: "https://example.com/kcad-hse-009" },
  { id: "kc-6", origin: "KCAD", name: "Rotating Equipment Safeguards", code: "KCAD-RM-006", revision: "Rev. 02", category: "Rig Management", activities: ["tools-equipment", "maintenance-electrical", "mud-solids"], lastUpdated: "30 Jan 2025", country: "uk", region: "united-kingdom", rig: "rig-1", url: "https://example.com/kcad-rm-006" },
];



export function ScopeScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const [regions, setRegions] = useState<string[]>([]);
  const [rigTypes, setRigTypes] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);

  // AI Modal States
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleActivity = (id: string) => {
    setSelectedActivities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const { hpDocs, kcadDocs } = useMemo(() => {
    const rawFiltered = SOURCE_DOCUMENTS.filter(doc => {
      if (regions.length > 0 && !regions.includes(doc.region)) return false;
      if (rigTypes.length > 0 && !rigTypes.includes(doc.rig)) return false;
      if (selectedActivities.length > 0 && !doc.activities.some(a => selectedActivities.includes(a))) return false;
      return true;
    });

    // Ensure at least 5 documents per column for demo purposes
    let hp = rawFiltered.filter(d => d.origin === "H&P");
    if (hp.length < 5) {
      const allHp = SOURCE_DOCUMENTS.filter(d => d.origin === "H&P");
      const missing = allHp.filter(d => !hp.includes(d));
      hp = [...hp, ...missing].slice(0, Math.max(5, hp.length));
    }

    let kc = rawFiltered.filter(d => d.origin === "KCAD");
    if (kc.length < 5) {
      const allKc = SOURCE_DOCUMENTS.filter(d => d.origin === "KCAD");
      const missing = allKc.filter(d => !kc.includes(d));
      kc = [...kc, ...missing].slice(0, Math.max(5, kc.length));
    }

    return { hpDocs: hp, kcadDocs: kc };
  }, [regions, rigTypes, selectedActivities]);

  const hpSelectedCount = hpDocs.filter(d => selectedDocs.includes(d.id)).length;
  const kcadSelectedCount = kcadDocs.filter(d => selectedDocs.includes(d.id)).length;
  const totalSelectedCount = hpSelectedCount + kcadSelectedCount;

  const toggleDoc = (id: string) => {
    setSelectedDocs(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const toggleAll = (docs: SourceDocument[]) => {
    const allIds = docs.map(d => d.id);
    const allSelected = allIds.every(id => selectedDocs.includes(id));
    if (allSelected) {
      setSelectedDocs(prev => prev.filter(id => !allIds.includes(id)));
    } else {
      setSelectedDocs(prev => Array.from(new Set([...prev, ...allIds])));
    }
  };

  useEffect(() => {
    if (!isGenerating) return;

    let progressInterval: ReturnType<typeof setInterval>;
    let statusInterval: ReturnType<typeof setInterval>;
    let successTimeout: ReturnType<typeof setTimeout>;

    const duration = 4000;
    const intervalTime = 50;
    const increment = 100 / (duration / intervalTime);
    let currentProgress = 0;

    progressInterval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(progressInterval);
        setIsSuccess(true);
        successTimeout = setTimeout(() => {
          navigate("/review");
        }, 600);
      }
      setProgress(Math.min(currentProgress, 100));
    }, intervalTime);

    statusInterval = setInterval(() => {
      setStatusIndex(prev => (prev + 1) % STATUS_MESSAGES_COUNT);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
      if (successTimeout) clearTimeout(successTimeout);
    };
  }, [isGenerating, navigate]);

  const handleNext = () => {
    setIsGenerating(true);
    setProgress(0);
    setStatusIndex(0);
    setIsSuccess(false);
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-page)", fontFamily: "Inter, sans-serif" }}
    >
      <Header breadcrumb={t("scope.title")} showOnlineStatus={true} showUser={true} />

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
                values={regions}
                onChange={setRegions}
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
                values={rigTypes}
                onChange={setRigTypes}
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
            <h2 className="text-[14px] font-bold text-[var(--text-secondary)] uppercase tracking-wide mb-2">{t("scope.filterByActivity")}</h2>
            <div className="grid grid-cols-8 gap-3">
              {ACTIVITIES.map(activity => {
                const isSelected = selectedActivities.includes(activity.id);
                return (
                  <div
                    key={activity.id}
                    onClick={() => toggleActivity(activity.id)}
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
            docs={hpDocs}
            selectedDocs={selectedDocs}
            onToggleDoc={toggleDoc}
            onToggleAll={() => toggleAll(hpDocs)}
            badgeBg="rgba(43,85,151,0.1)"
            badgeColor="var(--color-brand)"
            badgeBorder="rgba(43,85,151,0.25)"
          />

          {/* ── KCAD Column ── */}
          <DocumentColumn
            origin="KCAD"
            docs={kcadDocs}
            selectedDocs={selectedDocs}
            onToggleDoc={toggleDoc}
            onToggleAll={() => toggleAll(kcadDocs)}
            badgeBg="var(--bg-hover)"
            badgeColor="var(--text-secondary)"
            badgeBorder="var(--bg-hover)"
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
            onClick={() => setSelectedDocs([])}
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
          onClick={handleBack}
        />
        <FooterButton
          label={totalSelectedCount > 0 ? t("scope.proceedSelected", { count: totalSelectedCount }) : t("common.proceed")}
          icon={<Sparkles className="w-[14px] h-[14px]" />}
          variant="primary"
          onClick={handleNext}
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
  badgeBg,
  badgeColor,
  badgeBorder,
}: {
  origin: "H&P" | "KCAD";
  docs: SourceDocument[];
  selectedDocs: string[];
  onToggleDoc: (id: string) => void;
  onToggleAll: () => void;
  badgeBg: string;
  badgeColor: string;
  badgeBorder: string;
}) {
  const { t } = useTranslation();
  const columnSelectedCount = docs.filter(d => selectedDocs.includes(d.id)).length;
  const allSelected = docs.length > 0 && columnSelectedCount === docs.length;
  const isIndeterminate = columnSelectedCount > 0 && columnSelectedCount < docs.length;

  return (
    <div
      className="rounded-[10px] flex flex-col overflow-hidden"
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
          />
        </div>
        <Badge
          variant="outline"
          className="text-[12px] font-semibold h-6 px-2.5"
          style={{
            backgroundColor: badgeBg,
            color: badgeColor,
            borderColor: badgeBorder,
          }}
        >
          {origin}
        </Badge>
        <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
          {origin === "H&P" ? t("scope.column.hpDocuments") : t("scope.column.kcadDocuments")}
        </span>
        <span className="text-[12px] font-medium ml-auto" style={{ color: "var(--text-muted)" }}>
          ({docs.length})
        </span>
      </div>

      {/* Document List — max-height with scroll */}
      <div className="flex flex-col overflow-y-auto" style={{ maxHeight: 6 * 68 }}>
        {docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 px-6">
            <FolderSearch className="w-[28px] h-[28px]" style={{ color: "var(--text-muted)", opacity: 0.4 }} />
            <p className="text-[13px] text-center" style={{ color: "var(--text-muted)" }}>
              {t("scope.noDocuments", { origin })}
            </p>
          </div>
        ) : (
          docs.map((doc) => {
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
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 shrink-0 text-[12px] font-semibold rounded-[5px] px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  style={{
                    color: "var(--color-brand)",
                    backgroundColor: "rgba(43,85,151,0.08)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {t("common.view", "View")}
                  <ExternalLink className="w-[12px] h-[12px]" />
                </a>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

