import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { StickyFooter, FooterButton } from "../components/StickyFooter";
import { SearchableSelect } from "../components/SearchableSelect";
import { Badge } from "../components/ui/badge";
import { MapPin, Info, ArrowLeft, Sparkles, FileText, ExternalLink, FolderSearch } from "lucide-react";

const JOB_TYPES = [
  { id: "inspection", name: "Inspection", img: "/assets/site-conditions/inspection.png" },
  { id: "maintenance", name: "Maintenance", img: "/assets/site-conditions/maintenance.png" },
  { id: "drilling", name: "Drilling", img: "/assets/site-conditions/drilling.png" },
];

/* ── Mock Document Data ── */
interface SourceDocument {
  id: string;
  origin: "H&P" | "KCAD";
  name: string;
  code: string;
  revision: string;
  category: string;
  lastUpdated: string;
  country: string;   // matches dropdown value
  region: string;    // matches dropdown value
  rig: string;       // matches dropdown value
  url: string;
}

const SOURCE_DOCUMENTS: SourceDocument[] = [
  // ── H&P Documents ──
  { id: "hp-1", origin: "H&P", name: "Hot Work Procedure", code: "HSE-005", revision: "Rev. 06", category: "HSE", lastUpdated: "05 Jan 2025", country: "us", region: "tx", rig: "rig-1", url: "https://example.com/hse-005" },
  { id: "hp-2", origin: "H&P", name: "H₂S Monitoring and Response", code: "HSE-012", revision: "Rev. 03", category: "HSE", lastUpdated: "14 Mar 2024", country: "us", region: "tx", rig: "rig-1", url: "https://example.com/hse-012" },
  { id: "hp-3", origin: "H&P", name: "Well Control Manual", code: "WC-001", revision: "Rev. 04", category: "Well Control", lastUpdated: "01 Nov 2024", country: "us", region: "tx", rig: "rig-2", url: "https://example.com/wc-001" },
  { id: "hp-4", origin: "H&P", name: "Emergency Response Plan", code: "EM-003", revision: "Rev. 02", category: "Emergency Response", lastUpdated: "22 Aug 2024", country: "us", region: "pa", rig: "rig-3", url: "https://example.com/em-003" },
  { id: "hp-5", origin: "H&P", name: "Rig Floor Safety Procedures", code: "RM-007", revision: "Rev. 05", category: "Rig Management", lastUpdated: "10 Jun 2024", country: "us", region: "pa", rig: "rig-3", url: "https://example.com/rm-007" },
  { id: "hp-6", origin: "H&P", name: "BOP Testing & Maintenance", code: "WC-004", revision: "Rev. 03", category: "Well Control", lastUpdated: "28 Sep 2024", country: "ca", region: "tx", rig: "rig-1", url: "https://example.com/wc-004" },
  { id: "hp-7", origin: "H&P", name: "Confined Space Entry", code: "HSE-018", revision: "Rev. 02", category: "HSE", lastUpdated: "03 Feb 2025", country: "us", region: "nd", rig: "rig-2", url: "https://example.com/hse-018" },
  { id: "hp-8", origin: "H&P", name: "Crane Operations Manual", code: "RM-011", revision: "Rev. 04", category: "Rig Management", lastUpdated: "19 Apr 2024", country: "us", region: "tx", rig: "rig-1", url: "https://example.com/rm-011" },
  // ── KCAD Documents ──
  { id: "kc-1", origin: "KCAD", name: "Global HSE Standard", code: "KCAD-HSE-001", revision: "Rev. 08", category: "HSE", lastUpdated: "12 Dec 2024", country: "us", region: "tx", rig: "rig-1", url: "https://example.com/kcad-hse-001" },
  { id: "kc-2", origin: "KCAD", name: "Environmental Compliance Guide", code: "KCAD-ENV-003", revision: "Rev. 05", category: "Environmental", lastUpdated: "20 Nov 2024", country: "us", region: "tx", rig: "rig-2", url: "https://example.com/kcad-env-003" },
  { id: "kc-3", origin: "KCAD", name: "Well Integrity Management", code: "KCAD-WI-002", revision: "Rev. 03", category: "Well Control", lastUpdated: "15 Jul 2024", country: "us", region: "pa", rig: "rig-3", url: "https://example.com/kcad-wi-002" },
  { id: "kc-4", origin: "KCAD", name: "Emergency Equipment Requirements", code: "KCAD-EM-004", revision: "Rev. 06", category: "Emergency Response", lastUpdated: "01 Oct 2024", country: "ca", region: "tx", rig: "rig-1", url: "https://example.com/kcad-em-004" },
  { id: "kc-5", origin: "KCAD", name: "Personnel Safety Handbook", code: "KCAD-HSE-009", revision: "Rev. 04", category: "HSE", lastUpdated: "08 May 2024", country: "us", region: "nd", rig: "rig-2", url: "https://example.com/kcad-hse-009" },
  { id: "kc-6", origin: "KCAD", name: "Rotating Equipment Safeguards", code: "KCAD-RM-006", revision: "Rev. 02", category: "Rig Management", lastUpdated: "30 Jan 2025", country: "us", region: "tx", rig: "rig-1", url: "https://example.com/kcad-rm-006" },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "HSE": { bg: "rgba(43,85,151,0.1)", text: "var(--color-brand)" },
  "Well Control": { bg: "rgba(180,83,9,0.1)", text: "#b45309" },
  "Emergency Response": { bg: "rgba(220,38,38,0.1)", text: "#dc2626" },
  "Rig Management": { bg: "rgba(17,104,68,0.1)", text: "var(--color-positive)" },
  "Environmental": { bg: "rgba(14,116,144,0.1)", text: "#0e7490" },
};

export function ScopeScreen() {
  const navigate = useNavigate();
  const [selectedJobType, setSelectedJobType] = useState<string>("inspection");

  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [rig, setRig] = useState("");

  const filteredDocs = useMemo(() => {
    return SOURCE_DOCUMENTS.filter(doc => {
      if (country && doc.country !== country) return false;
      if (region && doc.region !== region) return false;
      if (rig && doc.rig !== rig) return false;
      return true;
    });
  }, [country, region, rig]);

  const hpDocs = filteredDocs.filter(d => d.origin === "H&P");
  const kcadDocs = filteredDocs.filter(d => d.origin === "KCAD");

  const handleNext = () => {
    navigate("/review");
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-page)", fontFamily: "Inter, sans-serif" }}
    >
      <Header breadcrumb="Scope" showOnlineStatus={true} showUser={true} />

      <main className="flex-1 w-full px-[24px] flex flex-col pb-5 mt-2 overflow-y-auto">
        {/* Title row */}
        <div className="flex items-center justify-between mt-8 mb-4">
          <h1 className="text-[14px] font-bold text-[var(--text-primary)] uppercase tracking-wide">
            Scope
          </h1>
          <button
            className="flex items-center gap-2 h-9 px-3 rounded-[6px] text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer bg-transparent"
            style={{ border: "var(--border-default)" }}
          >
            <MapPin className="w-[14px] h-[14px]" />
            Auto-detect from GPS
          </button>
        </div>

        {/* Dropdowns Card */}
        <div className="bg-[var(--bg-card)] rounded-[8px] p-6 mb-4 shadow-sm" style={{ border: "var(--border-default)" }}>
          <div className="grid grid-cols-3 gap-6">
            <SearchableSelect
              label="Country"
              value={country}
              onChange={setCountry}
              options={[
                { value: "us", label: "United States" },
                { value: "ca", label: "Canada" },
                { value: "uk", label: "United Kingdom" },
              ]}
              placeholder="Select Country"
            />

            <SearchableSelect
              label="Region"
              value={region}
              onChange={setRegion}
              options={[
                { value: "tx", label: "Texas" },
                { value: "pa", label: "Pennsylvania" },
                { value: "nd", label: "North Dakota" },
              ]}
              placeholder="Select Region"
            />

            <SearchableSelect
              label="Rig"
              value={rig}
              onChange={setRig}
              options={[
                { value: "rig-1", label: "Rig 104" },
                { value: "rig-2", label: "Rig 205" },
                { value: "rig-3", label: "Rig 308" },
              ]}
              placeholder="Select Rig"
            />
          </div>
        </div>

        {/* Job Type Card */}
        <div className="bg-[var(--bg-card)] rounded-[8px] p-6 mb-4 shadow-sm" style={{ border: "var(--border-default)" }}>
          <h2 className="text-[14px] font-bold text-[var(--text-secondary)] uppercase tracking-wide mb-5">Categories</h2>
          <div className="grid grid-cols-3 gap-6">
            {JOB_TYPES.map(type => (
              <div
                key={type.id}
                onClick={() => setSelectedJobType(type.id)}
                className={`flex items-center h-[90px] rounded-[10px] overflow-hidden cursor-pointer transition-all ${selectedJobType === type.id
                  ? 'bg-[var(--bg-hover)] shadow-sm'
                  : 'opacity-90 hover:opacity-100'
                  }`}
                style={{
                  border: selectedJobType === type.id ? "2px solid var(--color-brand)" : "1px solid var(--color-brand)"
                }}
              >
                <img src={type.img} alt={type.name} className="w-[120px] h-full object-cover border-r border-[var(--color-brand)] bg-[var(--bg-hover)]" />
                <span className="ml-[24px] text-[15px] font-semibold text-[var(--color-brand)] tracking-wide">
                  {type.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Note Box */}
        <div className="bg-[var(--bg-card)] rounded-[8px] py-[14px] px-[16px] shadow-sm flex items-center gap-[12px] mb-6" style={{ border: "var(--border-default)" }}>
          <Info className="w-[16px] h-[16px] text-[var(--text-muted)]" />
          <span className="text-[13px] font-medium text-[var(--text-secondary)] tracking-tight">AI will generate the document</span>
        </div>

        {/* ══════ Source Documents Section ══════ */}
        <div className="flex flex-col gap-2 mb-4">
          <h2 className="text-[14px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--text-secondary)" }}>
            Source Documents
          </h2>
          <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
            Documents that will be used to generate the consolidated safety document for this scope.
          </p>
        </div>

        {/* Two Column Document Library */}
        <div className="grid grid-cols-2 gap-5">
          {/* ── H&P Column ── */}
          <DocumentColumn
            origin="H&P"
            docs={hpDocs}
            badgeBg="rgba(43,85,151,0.1)"
            badgeColor="var(--color-brand)"
            badgeBorder="rgba(43,85,151,0.25)"
          />

          {/* ── KCAD Column ── */}
          <DocumentColumn
            origin="KCAD"
            docs={kcadDocs}
            badgeBg="var(--bg-hover)"
            badgeColor="var(--text-secondary)"
            badgeBorder="var(--bg-hover)"
          />
        </div>
      </main>

      <StickyFooter justify="between">
        <FooterButton
          label="Back"
          icon={<ArrowLeft className="w-[14px] h-[14px]" />}
          variant="secondary"
          onClick={handleBack}
        />
        <FooterButton
          label="Proceed"
          icon={<Sparkles className="w-[14px] h-[14px]" />}
          variant="primary"
          onClick={handleNext}
        />
      </StickyFooter>
    </div>
  );
}

/* ── Document Column Component ── */
function DocumentColumn({
  origin,
  docs,
  badgeBg,
  badgeColor,
  badgeBorder,
}: {
  origin: "H&P" | "KCAD";
  docs: SourceDocument[];
  badgeBg: string;
  badgeColor: string;
  badgeBorder: string;
}) {
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
          {origin} Documents
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
              No {origin} documents found for this scope.
            </p>
          </div>
        ) : (
          docs.map((doc) => {
            const catColors = CATEGORY_COLORS[doc.category] ?? { bg: "var(--bg-hover)", text: "var(--text-secondary)" };
            return (
              <div
                key={doc.id}
                className="flex items-center gap-3 px-5 py-3 cursor-default group"
                style={{
                  borderBottom: "var(--border-subtle)",
                  transition: "background-color 150ms ease-in, opacity 200ms ease-out, max-height 200ms ease-out",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                {/* Icon */}
                <div
                  className="w-[32px] h-[32px] rounded-[6px] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "var(--bg-hover)" }}
                >
                  <FileText className="w-[16px] h-[16px]" style={{ color: "var(--text-muted)" }} />
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

                {/* Category Badge */}
                <Badge
                  variant="secondary"
                  className="text-[12px] font-medium px-2 py-0.5 shrink-0"
                  style={{
                    backgroundColor: catColors.bg,
                    color: catColors.text,
                    border: "none",
                  }}
                >
                  {doc.category}
                </Badge>

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
                  View
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

