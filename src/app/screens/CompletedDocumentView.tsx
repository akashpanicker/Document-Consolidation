import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { ArrowLeft, FileText, Download, CheckCircle, Check, ExternalLink } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Toaster } from "../components/ui/sonner";

/* ── Mock Data ── */

const DOC_DATA = {
  id: "hse-005",
  name: "HSE 005 — Hot Work Procedure",
  code: "HSE-005",
  revision: "01",
  type: "Procedure" as const,
  consolidationDate: "06 Apr 2026",
  approvedBy: ["John Doe", "Marcos de Almeida", "Sarah Smith"],
  status: "Published",
  sections: [
    {
      id: "s1",
      title: "1. Purpose & Scope",
      paragraphs: [
        {
          id: "p1",
          text: "This procedure establishes the minimum safety requirements to be followed for all hot work activities conducted at rig locations. Its primary objective is to prevent fire-related incidents through standardized ignition source control.",
          sources: [
            { documentName: "H&P Hot Work Standard v2.0", origin: "H&P" as const, url: "/documents/hp/HSE-005-Hot-Work-Standard-v2.0.pdf" },
            { documentName: "KCAD Global Safety Guidelines", origin: "KCAD" as const, url: "/documents/kcad/KCAD-Global-Safety-Guidelines.pdf" },
          ],
        },
        {
          id: "p2",
          text: "The scope includes all welding, burning, cutting, and other sparks or flame-producing activities. It applies to all H&P and contractor personnel without exception.",
          sources: [
            { documentName: "H&P Hot Work Standard v2.0", origin: "H&P" as const, url: "/documents/hp/HSE-005-Hot-Work-Standard-v2.0.pdf" },
          ],
        },
      ],
    },
    {
      id: "s2",
      title: "2. Hazard Identification & Controls",
      paragraphs: [
        {
          id: "p3",
          text: "Prior to any hot work, a thorough hazard assessment must be conducted. All flammable materials must be removed or properly shielded within a 10-meter (35-foot) radius of the work site.",
          sources: [
            { documentName: "H&P Hot Work Standard v2.0", origin: "H&P" as const, url: "/documents/hp/HSE-005-Hot-Work-Standard-v2.0.pdf" },
          ],
        },
        {
          id: "p4",
          text: "A dedicated fire watch must be stationed at the site. This individual must remain on site for at least 30 minutes after hot work has been completed to monitor for smoldering materials.",
          sources: [
            { documentName: "KCAD Global Safety Guidelines", origin: "KCAD" as const, url: "/documents/kcad/KCAD-Global-Safety-Guidelines.pdf" },
          ],
        },
      ],
    },
    {
      id: "s3",
      title: "3. PPE & Equipment",
      paragraphs: [
        {
          id: "p5",
          text: "All personnel involved in hot work must wear task-specific PPE, including flame-resistant clothing, leather gloves, and appropriate face shields or goggles. All equipment must be inspected for damage prior to each shift.",
          sources: [
            { documentName: "H&P Hot Work Standard v2.0", origin: "H&P" as const, url: "/documents/hp/HSE-005-Hot-Work-Standard-v2.0.pdf" },
            { documentName: "KCAD Global Safety Guidelines", origin: "KCAD" as const, url: "/documents/kcad/KCAD-Global-Safety-Guidelines.pdf" },
          ],
        },
      ],
    },
  ],
  appendices: [
    {
      id: "appendix-a",
      title: "Appendix A — Australia Flex 3 Rig Requirements",
      paragraphs: [
        {
          id: "ap1",
          text: "On Flex 3 rigs operating in Australia, additional ventilation systems must be active during all hot work in confined spaces. Local regulatory permits must be obtained prior to work initiation.",
          sources: [
            { documentName: "Australia Rig Ops v1.1", origin: "H&P" as const, url: "/documents/hp/Australia-Rig-Ops-v1.1.pdf" },
          ],
        },
        {
          id: "ap2",
          text: "A dual-gas monitor is mandatory for continuous tracking of explosive gas levels and oxygen concentrations during the process.",
          sources: [
            { documentName: "Australia Rig Ops v1.1", origin: "H&P" as const, url: "/documents/hp/Australia-Rig-Ops-v1.1.pdf" },
          ],
        },
      ],
    },
  ],
  approvalTrail: [
    {
      name: "John Doe",
      role: "Operations Manager",
      date: "04 Apr 2026, 09:12 AM",
      status: "Approved",
      comment: null,
    },
    {
      name: "Marcos de Almeida",
      role: "Sr. QHSC Mgr",
      date: "05 Apr 2026, 02:45 PM",
      status: "Approved",
      comment: null,
    },
    {
      name: "Sarah Smith",
      role: "HSE Specialist",
      date: "06 Apr 2026, 11:30 AM",
      status: "Approved",
      comment: null,
    },
  ],
};

const SECTION_IDS = DOC_DATA.sections.map(s => s.id);

type SourceEntry = { documentName: string; origin: "H&P" | "KCAD"; url: string };

/* Deduplicated list of all source documents used across sections + appendices */
const SOURCE_DOCUMENTS_USED = (() => {
  const seen = new Set<string>();
  const result: SourceEntry[] = [];
  const allSources: SourceEntry[] = [
    ...DOC_DATA.sections.flatMap(s => s.paragraphs.flatMap(p => p.sources)),
    ...DOC_DATA.appendices.flatMap(a => a.paragraphs.flatMap(p => p.sources)),
  ];
  for (const src of allSources) {
    if (!seen.has(src.documentName)) {
      seen.add(src.documentName);
      result.push(src);
    }
  }
  return result;
})();

export function CompletedDocumentView() {
  const navigate = useNavigate();
  const [activeSectionId, setActiveSectionId] = useState<string>("s1");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const centerRef = useRef<HTMLDivElement>(null);

  /* ── IntersectionObserver — same pattern as Review screen ── */
  useEffect(() => {
    const scrollContainer = centerRef.current;
    if (!scrollContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const sId = entry.target.getAttribute("data-section-id");
            if (sId) setActiveSectionId(sId);
          }
        }
      },
      { root: scrollContainer, rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    SECTION_IDS.forEach(id => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = sectionRefs.current[sectionId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleExport = (_type: string) => {
    // export not yet implemented
  };

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-page)", fontFamily: "Inter, sans-serif" }}
    >
      <Toaster position="top-center" />
      <Header
        breadcrumb={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "View" },
        ]}
        showUser={true}
      />

      {/* ── Hero / Action Bar ── */}
      <div
        className="flex items-center justify-between px-6 shrink-0"
        style={{
          height: 72,
          backgroundColor: "var(--bg-card)",
          borderBottom: "var(--border-default)",
        }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center rounded-md transition-colors"
            style={{
              width: 32,
              height: 32,
              backgroundColor: "var(--bg-hover)",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-active)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1
            className="text-[20px] font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {DOC_DATA.name}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-[13px] font-semibold h-9 px-4"
            onClick={() => handleExport("Word")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export Word
          </Button>
          <Button
            size="sm"
            className="text-[13px] font-semibold h-9 px-4"
            style={{ backgroundColor: "var(--color-brand)", color: "var(--text-on-primary)" }}
            onClick={() => handleExport("PDF")}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* ── Metadata Bar ── */}
      <div
        className="px-6 py-3 flex items-center gap-5 shrink-0 overflow-x-auto whitespace-nowrap"
        style={{ borderBottom: "var(--border-default)", backgroundColor: "var(--bg-header)" }}
      >
        <span className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
          {DOC_DATA.code} · Rev. {DOC_DATA.revision}
        </span>
        <div className="w-px h-4" style={{ backgroundColor: "var(--border-default)" }} />
        <Badge
          variant="outline"
          className="text-[10px] font-bold h-5 px-2 tracking-wide uppercase"
          style={{
            backgroundColor: "rgba(43,85,151,0.08)",
            color: "var(--color-brand)",
            borderColor: "rgba(43,85,151,0.2)",
          }}
        >
          {DOC_DATA.type}
        </Badge>
        <div className="w-px h-4" style={{ backgroundColor: "var(--border-default)" }} />
        <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
          Consolidated on {DOC_DATA.consolidationDate}
        </span>
        <div className="w-px h-4" style={{ backgroundColor: "var(--border-default)" }} />
        <span className="text-[13px]" style={{ color: "var(--text-muted)" }}>
          <span className="font-semibold" style={{ color: "var(--text-secondary)" }}>Approved by:</span>{" "}
          {DOC_DATA.approvedBy.join(", ")}
        </span>
        <div className="ml-auto">
          <Badge
            variant="outline"
            className="text-[11px] font-bold px-3 py-1"
            style={{
              color: "var(--color-positive)",
              borderColor: "var(--color-positive)",
              backgroundColor: "var(--color-positive-bg)",
            }}
          >
            {DOC_DATA.status}
          </Badge>
        </div>
      </div>

      {/* ── Three Column Layout ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Column 1: Section Navigation ── */}
        <div
          className="shrink-0 flex flex-col py-6 px-5 overflow-y-auto"
          style={{
            width: 220,
            borderRight: "var(--border-default)",
            backgroundColor: "var(--bg-card)",
          }}
        >
          <span
            className="text-[12px] font-bold uppercase tracking-[0.1em] mb-5"
            style={{ color: "var(--text-muted)" }}
          >
            IN THIS DOCUMENT
          </span>

          <nav className="flex flex-col gap-1">
            {DOC_DATA.sections.map(s => {
              const isActive = activeSectionId === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => scrollToSection(s.id)}
                  className="group cursor-pointer rounded-lg p-2 transition-colors"
                  style={{ backgroundColor: isActive ? "var(--bg-hover)" : "transparent" }}
                >
                  <span
                    className="text-[13px] font-semibold leading-tight"
                    style={{ color: isActive ? "var(--color-brand)" : "var(--text-secondary)" }}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}

            <div className="mt-4 pt-4" style={{ borderTop: "var(--border-subtle)" }}>
              <button
                onClick={() => {
                  scrollToSection("appendices");
                  setActiveSectionId("appendices");
                }}
                className="text-left w-full px-3 py-2.5 rounded-[6px] transition-all duration-150"
                style={{
                  backgroundColor: activeSectionId === "appendices" ? "var(--bg-hover)" : "transparent",
                  borderLeft: activeSectionId === "appendices" ? "3px solid var(--color-brand)" : "3px solid transparent",
                  border: "none",
                  borderLeftWidth: 3,
                  borderLeftStyle: "solid",
                  borderLeftColor: activeSectionId === "appendices" ? "var(--color-brand)" : "transparent",
                  cursor: "pointer",
                }}
              >
                <span
                  className="text-[13px] leading-tight"
                  style={{
                    color: activeSectionId === "appendices" ? "var(--text-primary)" : "var(--text-secondary)",
                    fontWeight: activeSectionId === "appendices" ? 700 : 500,
                  }}
                >
                  Appendices
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* ── Column 2: Document Body ── */}
        <div
          className="flex-1 overflow-y-auto px-8 py-8"
          ref={centerRef}
        >
          <div className="max-w-[800px] mx-auto flex flex-col gap-8">
            {DOC_DATA.sections.map(section => (
              <div
                key={section.id}
                ref={(el) => { sectionRefs.current[section.id] = el; }}
                data-section-id={section.id}
                className="flex flex-col gap-1 rounded-[12px] overflow-hidden scroll-mt-4"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "var(--border-default)",
                }}
              >
                <div className="px-6 py-4" style={{ borderBottom: "var(--border-subtle)" }}>
                  <h2 className="text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>
                    {section.title}
                  </h2>
                </div>

                <div className="flex flex-col">
                  {section.paragraphs.map(p => (
                    <div
                      key={p.id}
                      style={{
                        padding: "16px 24px 16px 20px",
                        borderLeft: "4px solid transparent",
                        borderBottom: "none",
                      }}
                    >
                      <div className="flex flex-col gap-2">
                        <span
                          className="text-[15px] leading-relaxed font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {p.text}
                        </span>

                        {p.sources.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {p.sources.map((src, i) => (
                              <div
                                key={i}
                                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] border cursor-default select-none"
                                style={{
                                  backgroundColor: src.origin === "H&P"
                                    ? "rgba(43, 85, 151, 0.04)"
                                    : "rgba(111, 143, 217, 0.04)",
                                  borderColor: src.origin === "H&P"
                                    ? "rgba(43, 85, 151, 0.35)"
                                    : "rgba(111, 143, 217, 0.35)",
                                  fontSize: 11,
                                  color: src.origin === "H&P"
                                    ? "var(--color-brand)"
                                    : "var(--color-info)",
                                  opacity: 0.75,
                                }}
                              >
                                <span
                                  className="max-w-[220px] truncate font-normal"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  {src.documentName}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* ── Appendices ── */}
            <div
              id="appendix-zone"
              data-section-id="appendices"
              ref={(el) => { sectionRefs.current["appendices"] = el; }}
              className="scroll-mt-4"
            >
              <div className="flex items-center gap-4 mb-6 mt-4">
                <div className="h-px flex-1" style={{ backgroundColor: "var(--border-default)" }} />
                <h3
                  className="text-[14px] font-bold uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  APPENDICES
                </h3>
                <div className="h-px flex-1" style={{ backgroundColor: "var(--border-default)" }} />
              </div>

              <div className="flex flex-col gap-8">
                {DOC_DATA.appendices.map(app => (
                  <div
                    key={app.id}
                    className="flex flex-col gap-1 rounded-[12px] overflow-hidden"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      border: "var(--border-default)",
                    }}
                  >
                    <div className="px-6 py-4" style={{ borderBottom: "var(--border-subtle)" }}>
                      <h2 className="text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>
                        {app.title}
                      </h2>
                    </div>
                    <div className="flex flex-col">
                      {app.paragraphs.map(p => (
                        <div
                          key={p.id}
                          style={{
                            padding: "16px 24px 16px 20px",
                            borderLeft: "4px solid transparent",
                            borderBottom: "none",
                          }}
                        >
                          <div className="flex flex-col gap-2">
                            <span
                              className="text-[15px] leading-relaxed font-medium"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {p.text}
                            </span>
                            {p.sources.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {p.sources.map((src, i) => (
                                  <div
                                    key={i}
                                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] border cursor-default select-none"
                                    style={{
                                      backgroundColor: src.origin === "H&P"
                                        ? "rgba(43, 85, 151, 0.04)"
                                        : "rgba(111, 143, 217, 0.04)",
                                      borderColor: src.origin === "H&P"
                                        ? "rgba(43, 85, 151, 0.35)"
                                        : "rgba(111, 143, 217, 0.35)",
                                      fontSize: 11,
                                      color: src.origin === "H&P"
                                        ? "var(--color-brand)"
                                        : "var(--color-info)",
                                      opacity: 0.75,
                                    }}
                                  >
                                    <span className="max-w-[220px] truncate font-normal" style={{ fontFamily: "Inter, sans-serif" }}>
                                      {src.documentName}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[200px]" />
          </div>
        </div>

        {/* ── Column 3: Approval Chain ── */}
        <div
          className="shrink-0 flex flex-col overflow-hidden"
          style={{
            width: 320,
            borderLeft: "var(--border-default)",
            backgroundColor: "var(--bg-card)",
          }}
        >
          {/* Header — matches Review right panel header style */}
          <div
            className="flex flex-col gap-3 px-4 py-4"
            style={{ borderBottom: "var(--border-default)" }}
          >
            <span
              className="text-[13px] font-bold uppercase tracking-wide"
              style={{ color: "var(--text-secondary)" }}
            >
              APPROVAL CHAIN
            </span>
          </div>

          {/* Timeline */}
          <div className="flex-1 overflow-y-auto px-4 py-5">
            <div className="flex flex-col">
              {DOC_DATA.approvalTrail.map((entry, i) => (
                <div key={i} className="flex gap-3">
                  {/* Dot + connecting line */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "var(--color-positive-bg)" }}
                    >
                      <Check className="w-[14px] h-[14px]" style={{ color: "var(--color-positive)" }} />
                    </div>
                    {i < DOC_DATA.approvalTrail.length - 1 && (
                      <div
                        className="flex-1 mt-2"
                        style={{
                          width: 1,
                          backgroundColor: "var(--border-default)",
                          minHeight: 16,
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-1 pb-5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[13px] font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {entry.name}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold h-5 px-1.5"
                        style={{
                          color: "var(--color-positive)",
                          borderColor: "var(--color-positive)",
                          backgroundColor: "var(--color-positive-bg)",
                        }}
                      >
                        {entry.status}
                      </Badge>
                    </div>
                    <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                      {entry.role}
                    </span>
                    <span className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
                      {entry.date}
                    </span>
                    {entry.comment && (
                      <div
                        className="mt-1.5 px-3 py-2.5 rounded-[6px]"
                        style={{ backgroundColor: "var(--bg-hover)" }}
                      >
                        <span
                          className="text-[13px] leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {entry.comment}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Connecting line from last reviewer to published */}
              <div className="flex gap-3">
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="w-px mt-0 mb-2"
                    style={{
                      height: 16,
                      backgroundColor: "var(--border-default)",
                      marginLeft: 10,
                    }}
                  />
                  <div
                    className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--color-positive)", color: "white" }}
                  >
                    <CheckCircle className="w-[14px] h-[14px]" />
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 pt-4">
                  <span
                    className="text-[13px] font-bold"
                    style={{ color: "var(--color-positive)" }}
                  >
                    Document Published
                  </span>
                  <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                    Fully approved on {DOC_DATA.consolidationDate}
                  </span>
                </div>
              </div>

              {/* Source Documents Used */}
              <div className="mt-6 pt-5" style={{ borderTop: "var(--border-default)" }}>
                <span
                  className="text-[13px] font-bold uppercase tracking-[0.08em] mb-3 block"
                  style={{ color: "var(--text-muted)" }}
                >
                  Source Documents Used
                </span>
                <div className="flex flex-col gap-2">
                  {SOURCE_DOCUMENTS_USED.map((src, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="shrink-0 px-1.5 py-0.5 rounded-[3px] text-[9px] font-bold text-center"
                        style={{
                          width: "36px",
                          backgroundColor: src.origin === "H&P"
                            ? "rgba(43, 85, 151, 0.1)"
                            : "rgba(111, 143, 217, 0.1)",
                          color: src.origin === "H&P"
                            ? "var(--color-brand)"
                            : "var(--color-info)",
                        }}
                      >
                        {src.origin}
                      </div>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[12px] leading-snug"
                        style={{ color: "var(--color-brand)", textDecoration: "none" }}
                        onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                      >
                        {src.documentName}
                        <ExternalLink className="w-[11px] h-[11px] shrink-0" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
