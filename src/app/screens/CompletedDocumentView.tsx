import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Header } from "../components/Header";
import { useTranslation } from "react-i18next";
import { ArrowLeft, FileText, Download, CheckCircle, ChevronDown } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { toast } from "sonner"; // Assuming sonner is used based on UI list, or we can use a simpler alert
import { Toaster } from "../components/ui/sonner";

/* ── Mock Data for HSE-005 ── */

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
            { documentName: "H&P Hot Work Standard v2.0", origin: "H&P" as const },
            { documentName: "KCAD Global Safety Guidelines", origin: "KCAD" as const }
          ]
        },
        {
          id: "p2",
          text: "The scope includes all welding, burning, cutting, and other sparks or flame-producing activities. It applies to all H&P and contractor personnel without exception.",
          sources: [
            { documentName: "H&P Hot Work Standard v2.0", origin: "H&P" as const }
          ]
        }
      ]
    },
    {
      id: "s2",
      title: "2. Hazard Identification & Controls",
      paragraphs: [
        {
          id: "p3",
          text: "Prior to any hot work, a thorough hazard assessment must be conducted. All flammable materials must be removed or properly shielded within a 10-meter (35-foot) radius of the work site.",
          sources: [
            { documentName: "H&P Hot Work Standard v2.0", origin: "H&P" as const }
          ]
        },
        {
          id: "p4",
          text: "A dedicated fire watch must be stationed at the site. This individual must remain on site for at least 30 minutes after hot work has been completed to monitor for smoldering materials.",
          sources: [
            { documentName: "KCAD Global Safety Guidelines", origin: "KCAD" as const }
          ]
        }
      ]
    },
    {
      id: "s3",
      title: "3. PPE & Equipment",
      paragraphs: [
        {
          id: "p5",
          text: "All personnel involved in hot work must wear task-specific PPE, including flame-resistant clothing, leather gloves, and appropriate face shields or goggles. All equipment must be inspected for damage prior to each shift.",
          sources: [
            { documentName: "H&P Hot Work Standard v2.0", origin: "H&P" as const },
            { documentName: "KCAD Global Safety Guidelines", origin: "KCAD" as const }
          ]
        }
      ]
    }
  ],
  appendices: [
    {
      title: "Appendix A — Australia Flex 3 Rig Requirements",
      paragraphs: [
        {
          id: "ap1",
          text: "On Flex 3 rigs operating in Australia, additional ventilation systems must be active during all hot work in confined spaces. Local regulatory permits must be obtained prior to work initiation.",
          sources: [
            { documentName: "Australia Rig Ops v1.1", origin: "H&P" as const }
          ]
        },
        {
          id: "ap2",
          text: "A dual-gas monitor is mandatory for continuous tracking of explosive gas levels and oxygen concentrations during the process.",
          sources: [
            { documentName: "Australia Rig Ops v1.1", origin: "H&P" as const }
          ]
        }
      ]
    }
  ],
  approvalTrail: [
    {
      name: "John Doe",
      role: "Operations Manager",
      date: "04 Apr 2026, 09:12 AM",
      status: "Approved",
      comment: "Looks solid. The 30 minute fire watch is a critical safety addition from the legacy standard."
    },
    {
      name: "Marcos de Almeida",
      role: "Sr. QHSC Mgr",
      date: "05 Apr 2026, 02:45 PM",
      status: "Approved",
      comment: null
    },
    {
      name: "Sarah Smith",
      role: "HSE Specialist",
      date: "06 Apr 2026, 11:30 AM",
      status: "Approved",
      comment: null
    }
  ]
};

export function CompletedDocumentView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [activeSectionId, setActiveSectionId] = useState<string>("s1");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollToSection = (sectionId: string) => {
    const el = sectionRefs.current[sectionId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSectionId(sectionId);
    }
  };

  const handleExport = (type: string) => {
    toast(`Export to ${type} coming soon`);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--bg-page)] overflow-hidden font-['Inter',sans-serif]">
      <Toaster position="top-center" />
      <Header
        breadcrumb={[
          { label: "Project Dashboard", path: "/dashboard" },
          { label: "View Mode" }
        ]}
        showUser={true}
      />

      {/* Hero / Action Bar */}
      <div 
        className="flex items-center justify-between px-6 py-4 shrink-0 h-[72px]"
        style={{ backgroundColor: "var(--bg-card)", borderBottom: "var(--border-subtle)" }}
      >
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-full hover:bg-[var(--bg-hover)] transition-colors border border-[var(--border-default)]"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[20px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>{DOC_DATA.name}</h1>
          </div>
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
            variant="default" 
            size="sm" 
            className="text-[13px] font-semibold h-9 px-4 shadow-sm"
            style={{ backgroundColor: "var(--color-brand)" }}
            onClick={() => handleExport("PDF")}
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Metadata Bar */}
      <div 
        className="px-6 py-3 flex items-center gap-5 shrink-0 overflow-x-auto whitespace-nowrap"
        style={{ borderBottom: "var(--border-default)", backgroundColor: "var(--bg-header)" }}
      >
        <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
          <span>{DOC_DATA.code} · Rev. {DOC_DATA.revision}</span>
        </div>
        <div className="w-px h-4 bg-[var(--border-strong)] opacity-20" />
        <Badge 
          variant="outline" 
          className="text-[10px] font-bold h-5 px-2 tracking-wide uppercase"
          style={{ 
            backgroundColor: "rgba(43,85,151,0.08)", 
            color: "var(--color-brand)", 
            borderColor: "rgba(43,85,151,0.2)" 
          }}
        >
          {DOC_DATA.type}
        </Badge>
        <div className="w-px h-4 bg-[var(--border-strong)] opacity-20" />
        <div className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
          Consolidated on {DOC_DATA.consolidationDate}
        </div>
        <div className="w-px h-4 bg-[var(--border-strong)] opacity-20" />
        <div className="text-[13px] truncate" style={{ color: "var(--text-muted)" }}>
          <span className="font-semibold text-[var(--text-secondary)]">Approved by:</span> {DOC_DATA.approvedBy.join(", ")}
        </div>
        <div className="ml-auto flex items-center">
          <Badge 
            className="bg-[var(--color-positive)] text-white text-[11px] font-bold px-3 py-1 border-0 shadow-sm"
          >
            {DOC_DATA.status}
          </Badge>
        </div>
      </div>

      {/* Main content 3-column */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: Navigation */}
        <div 
          className="w-[240px] shrink-0 border-r border-[var(--border-default)] flex flex-col p-6 overflow-y-auto"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6 opacity-60" style={{ color: "var(--text-secondary)" }}>
            IN THIS DOCUMENT
          </span>
          <nav className="flex flex-col gap-1.5">
            {DOC_DATA.sections.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className="text-left px-3 py-2.5 rounded-lg transition-all duration-200 text-[13px] font-semibold"
                style={{
                  backgroundColor: activeSectionId === s.id ? "var(--bg-active)" : "transparent",
                  color: activeSectionId === s.id ? "var(--color-brand)" : "var(--text-secondary)",
                  borderLeft: activeSectionId === s.id ? "3px solid var(--color-brand)" : "3px solid transparent",
                }}
              >
                {idx + 1}. {s.title.split('. ')[1] || s.title}
              </button>
            ))}
            <div className="my-4 h-px bg-[var(--border-subtle)]" />
            <button
              onClick={() => scrollToSection("appendices")}
              className="text-left px-3 py-2.5 rounded-lg transition-all duration-200 text-[13px] font-semibold"
              style={{
                backgroundColor: activeSectionId === "appendices" ? "var(--bg-active)" : "transparent",
                color: activeSectionId === "appendices" ? "var(--color-brand)" : "var(--text-secondary)",
                borderLeft: activeSectionId === "appendices" ? "3px solid var(--color-brand)" : "3px solid transparent",
              }}
            >
              Appendices
            </button>
          </nav>
        </div>

        {/* Column 2: Document Body */}
        <div className="flex-1 overflow-y-auto px-16 py-12 scroll-smooth">
          <div className="max-w-[720px] mx-auto flex flex-col gap-12">
            {DOC_DATA.sections.map(section => (
              <div 
                key={section.id} 
                ref={(el) => { sectionRefs.current[section.id] = el; }}
                className="flex flex-col gap-6 scroll-mt-6"
              >
                <h2 className="text-[24px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                  {section.title}
                </h2>
                <div className="flex flex-col gap-10">
                  {section.paragraphs.map(p => (
                    <div key={p.id} className="flex flex-col gap-4">
                      <p className="text-[16px] leading-[1.7] text-[var(--text-secondary)] font-normal">
                        {p.text}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {p.sources.map((src, i) => (
                          <div 
                            key={i} 
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#F4F7FC] border border-[#E1E8F4]"
                          >
                            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: src.origin === 'H&P' ? "#2B5597" : "#0EA5E9" }}>{src.origin}</span>
                            <span className="text-[12px] font-medium text-[#4A5568]">{src.documentName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Appendices Container */}
            <div id="appendix-zone" ref={(el) => { sectionRefs.current["appendices"] = el; }} className="scroll-mt-8 pt-6">
              <div className="flex items-center gap-4 mb-10 opacity-50">
                <div className="h-px flex-1 bg-[var(--border-default)]" />
                <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">APPENDICES</h3>
                <div className="h-px flex-1 bg-[var(--border-default)]" />
              </div>

              <div className="flex flex-col gap-12">
                {DOC_DATA.appendices.map((app, i) => (
                  <div key={i} className="flex flex-col gap-6">
                    <h2 className="text-[22px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>{app.title}</h2>
                    <div className="flex flex-col gap-10">
                      {app.paragraphs.map(p => (
                        <div key={p.id} className="flex flex-col gap-4">
                          <p className="text-[16px] leading-[1.7] text-[var(--text-secondary)] font-normal">
                            {p.text}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {p.sources.map((src, i) => (
                              <div 
                                key={i} 
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#F4F7FC] border border-[#E1E8F4]"
                              >
                                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: src.origin === 'H&P' ? "#2B5597" : "#0EA5E9" }}>{src.origin}</span>
                                <span className="text-[12px] font-medium text-[#4A5568]">{src.documentName}</span>
                              </div>
                            ))}
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

        {/* Column 3: Approval Chain */}
        <div 
          className="w-[340px] shrink-0 border-l border-[var(--border-default)] flex flex-col overflow-hidden"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--bg-header)]">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--text-secondary)" }}>
              APPROVAL CHAIN
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-10 relative">
            {/* Timeline line */}
            <div className="absolute left-[38px] top-8 bottom-8 w-px bg-[var(--border-strong)] opacity-20" />
            
            {DOC_DATA.approvalTrail.map((entry, i) => (
              <div key={i} className="flex flex-col gap-4 relative z-10">
                <div className="flex items-start gap-4">
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-sm"
                    style={{ backgroundColor: "var(--color-success)", color: "white" }}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[14px] font-bold text-[var(--text-primary)]">{entry.name}</span>
                    <span className="text-[12px] font-medium text-[var(--text-muted)]">{entry.role}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className="text-[9px] h-4 py-0 px-1.5 font-bold uppercase tracking-tighter"
                        style={{ border: "1px solid var(--color-success)", color: "var(--color-success)", backgroundColor: "rgba(16,185,129,0.05)" }}
                      >
                        {entry.status}
                      </Badge>
                      <span className="text-[11px] font-medium" style={{ color: "var(--text-tertiary)" }}>{entry.date}</span>
                    </div>
                  </div>
                </div>
                {entry.comment && (
                  <div 
                    className="ml-[44px] p-4 rounded-lg border-l-4" 
                    style={{ 
                      backgroundColor: "#F0F7FF", 
                      borderColor: "#3B82F6", 
                      borderRadius: "6px" 
                    }}
                  >
                    <p className="text-[13px] leading-relaxed text-[#1E40AF] italic font-medium">
                      "{entry.comment}"
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Final Entry */}
            <div className="flex items-center gap-4 relative z-10 mt-2">
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: "var(--color-success)", color: "white" }}
              >
                <CheckCircle className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-[var(--text-primary)]">Document Published</span>
                <span className="text-[12px] font-medium text-[var(--text-muted)]">Fully approved on {DOC_DATA.consolidationDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
