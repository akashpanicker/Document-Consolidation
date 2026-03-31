import { useState, useRef, useEffect, useCallback, MouseEvent } from "react";
import { Header } from "../components/Header";
import { StickyFooter, FooterButton } from "../components/StickyFooter";
import { ArrowLeft, Check, FileSearch } from "lucide-react";
import { AnnotationCallout, AIConfidenceCard, ParagraphData } from "../components/AnnotationCallout";
import { useNavigate } from "react-router";

/* ── Custom keyframe styles injected via a <style> tag ── */
const REVIEW_STYLES = `
@keyframes stepper-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(43, 85, 151, 0.4); }
  50%      { box-shadow: 0 0 0 6px rgba(43, 85, 151, 0); }
}
.stepper-active-dot {
  animation: stepper-pulse 2s ease-in-out infinite;
}
`;

const REVIEWERS = [
  { name: "Reviewer 1", role: "Mgr", status: "completed" as const },
  { name: "Reviewer 2", role: "Sr. QHSC Mgr", status: "active" as const },
  { name: "Reviewer 3", role: "Mgr", status: "pending" as const },
];

const SECTIONS = [
  { id: "s1", title: "1. Purpose & Scope" },
  { id: "s2", title: "2. Hazard Identification & Controls" },
  { id: "s3", title: "3. Emergency Response" },
];

const INITIAL_PARAGRAPHS: ParagraphData[] = [
  // ── Section 1: Purpose & Scope ──
  {
    id: "p1", sectionId: "s1",
    text: "The purpose of this document is to establish the minimum safety requirements and operating procedures for well control equipment and practices across all active drilling locations.",
    sourceDocument: "H&P Well Control Manual v4.2", origin: "H&P",
    applicability: "Applies to: All Land Rigs",
    lastVerified: "Reviewed by J. Smith on Oct 12, 2025",
    regulatoryReferences: ["API RP 53"],
    aiConfidence: "High", aiReason: "Direct match to H&P source with no conflicts.",
    status: "pending", hpPercent: 98, kcadPercent: 2,
  },
  {
    id: "p2", sectionId: "s1",
    text: "These procedures must be strictly followed to prevent loss of well control, environmental release, and protect the health and safety of personnel on site.",
    sourceDocument: "KCAD Global HSE Standard", origin: "KCAD",
    applicability: "Applies to: All Locations",
    lastVerified: "Reviewed by M. Davis on Sep 01, 2025",
    regulatoryReferences: ["OSHA 1910.119", "EPA 40 CFR 112"],
    aiConfidence: "High", aiReason: "Safely integrated multiple regulatory requirements from KCAD legacy standard.",
    status: "pending", hpPercent: 25, kcadPercent: 75,
  },
  {
    id: "p3", sectionId: "s1",
    text: "This document applies to all H&P drilling operations conducted under the jurisdiction of this rig assignment, including but not limited to: rotary drilling, tripping, cementing, logging, and well intervention activities.",
    sourceDocument: "H&P Well Control Manual v4.2", origin: "H&P",
    applicability: "Applies to: All Land Rigs",
    lastVerified: "Reviewed by J. Smith on Oct 12, 2025",
    regulatoryReferences: ["API RP 53"],
    aiConfidence: "High", aiReason: "Direct match to H&P source with no conflicts.",
    status: "pending", hpPercent: 100, kcadPercent: 0,
  },
  {
    id: "p4", sectionId: "s1",
    text: "All personnel working on or near the rig floor are required to be familiar with the contents of this document prior to commencing operations. Compliance is mandatory regardless of crew role or employment status.",
    sourceDocument: "KCAD Global HSE Standard", origin: "KCAD",
    applicability: "Applies to: All Locations",
    lastVerified: "Reviewed by M. Davis on Sep 01, 2025",
    regulatoryReferences: ["OSHA 1910.119"],
    aiConfidence: "High", aiReason: "Standard compliance requirement inherited from KCAD.",
    status: "pending", hpPercent: 20, kcadPercent: 80,
  },
  {
    id: "p5", sectionId: "s1",
    text: "This document supersedes all previous well control procedures issued for this rig location. In the event of a conflict between this document and any third-party requirements, the more stringent standard shall apply.",
    sourceDocument: "H&P Well Control Manual v4.2", origin: "H&P",
    applicability: "Applies to: All Land Rigs",
    lastVerified: "Reviewed by J. Smith on Oct 12, 2025",
    regulatoryReferences: [],
    aiConfidence: "Medium", aiReason: "Supersession clause — verify against any active third-party agreements.",
    status: "pending", hpPercent: 85, kcadPercent: 15,
  },
  // ── Section 2: Hazard Identification & Controls ──
  {
    id: "p6", sectionId: "s2",
    text: "During tripping operations, a trip sheet must be maintained and verified every 5 stands to ensure hole fill volumes accurately match drill string displacement.",
    sourceDocument: "H&P Operations Manual", origin: "H&P",
    applicability: "Applies to: Land Rigs — Permian Basin",
    lastVerified: "Reviewed by A. Lewis on Jan 14, 2026",
    regulatoryReferences: [],
    aiConfidence: "Medium", aiReason: "Synthesized from multiple regional guidelines; requires manual verification.",
    status: "pending", hpPercent: 72, kcadPercent: 28,
  },
  {
    id: "p7", sectionId: "s2",
    text: "If a kick is detected, the driller must immediately shut in the well within 15 minutes of initial flow indication to prevent escalation.",
    sourceDocument: "Merged Safety Guidelines", origin: "KCAD",
    applicability: "Applies to: High Pressure High Temperature (HPHT) Wells",
    lastVerified: "System Generated",
    regulatoryReferences: ["API 59", "BSEE 250"],
    aiConfidence: "Low", aiReason: "Conflicting legacy standards detected during AI merge.",
    conflict: "KCAD specifies 15 min threshold, H&P specifies 30 min",
    status: "pending", hpPercent: 45, kcadPercent: 55,
  },
  {
    id: "p8", sectionId: "s2",
    text: "Prior to each drilling shift, the driller must verify that all BOP functions are operational and that the accumulator pressure is within the specified operating range. Any anomaly must be reported to the Rig Manager immediately and logged in the daily drilling report.",
    sourceDocument: "H&P Operations Manual", origin: "H&P",
    applicability: "Applies to: All Land Rigs",
    lastVerified: "Reviewed by A. Lewis on Jan 14, 2026",
    regulatoryReferences: ["API RP 53"],
    aiConfidence: "High", aiReason: "Direct match to H&P BOP verification protocols.",
    status: "pending", hpPercent: 95, kcadPercent: 5,
  },
  {
    id: "p9", sectionId: "s2",
    text: "H\u2082S monitoring equipment must be active at all times during operations in zones with known or suspected sour gas presence. Personal H\u2082S detectors are mandatory for all personnel on the rig floor and in the mud pit area.",
    sourceDocument: "KCAD Global HSE Standard", origin: "KCAD",
    applicability: "Applies to: Sour Gas Zones",
    lastVerified: "Reviewed by T. Nguyen on Feb 05, 2026",
    regulatoryReferences: ["OSHA 1910.1000", "API RP 49"],
    aiConfidence: "High", aiReason: "Standard H\u2082S monitoring requirement from KCAD.",
    status: "pending", hpPercent: 15, kcadPercent: 85,
  },
  {
    id: "p10", sectionId: "s2",
    text: "Drilling fluid weight must be maintained within the approved mud weight window at all times. Any deviation of more than 0.2 ppg from the planned mud weight requires immediate notification to the Drilling Engineer and Sr. QHSC Manager before operations continue.",
    sourceDocument: "H&P Operations Manual", origin: "H&P",
    applicability: "Applies to: All Land Rigs",
    lastVerified: "Reviewed by A. Lewis on Jan 14, 2026",
    regulatoryReferences: [],
    aiConfidence: "High", aiReason: "Direct match to H&P mud weight management procedures.",
    status: "pending", hpPercent: 97, kcadPercent: 3,
  },
  {
    id: "p11", sectionId: "s2",
    text: "Rotating equipment guards must be inspected at the beginning of each shift. No personnel are permitted within the rotating envelope during active drilling operations unless a formal permit to work has been issued.",
    sourceDocument: "KCAD Global HSE Standard", origin: "KCAD",
    applicability: "Applies to: All Locations",
    lastVerified: "Reviewed by M. Davis on Sep 01, 2025",
    regulatoryReferences: ["OSHA 1910.219"],
    aiConfidence: "High", aiReason: "Standard rotating equipment safety requirement.",
    status: "pending", hpPercent: 10, kcadPercent: 90,
  },
  // ── Section 3: Emergency Response ──
  {
    id: "p12", sectionId: "s3",
    text: "In the event of an uncontrolled flow, all non-essential personnel must immediately proceed to their designated muster points. The Rig Manager will initiate the site emergency response plan.",
    sourceDocument: "H&P Emergency Action Plan", origin: "H&P",
    applicability: "Applies to: All Land Rigs",
    lastVerified: "Reviewed by E. Torres on Nov 22, 2025",
    regulatoryReferences: ["OSHA 1910.38"],
    aiConfidence: "High", aiReason: "Direct match to universal H&P emergency protocols.",
    status: "pending", hpPercent: 96, kcadPercent: 4,
  },
  {
    id: "p13", sectionId: "s3",
    text: "BOP accumulators must maintain sufficient reserve pressure to close all preventers and hold them closed for a minimum of 2 hours without main power.",
    sourceDocument: "KCAD Equipment Requirements", origin: "KCAD",
    applicability: "Applies to: Offshore & Critical Land Rigs",
    lastVerified: "Reviewed by T. Nguyen on Feb 05, 2026",
    regulatoryReferences: ["API RP 53"],
    aiConfidence: "High", aiReason: "Standard equipment specification inherited from KCAD.",
    status: "pending", hpPercent: 12, kcadPercent: 88,
  },
  {
    id: "p14", sectionId: "s3",
    text: "Emergency shutdown procedures must be posted at the driller's console, the doghouse entrance, and at each muster point. All crew members must complete emergency response drills at a minimum frequency of once per 14-day hitch.",
    sourceDocument: "H&P Emergency Action Plan", origin: "H&P",
    applicability: "Applies to: All Land Rigs",
    lastVerified: "Reviewed by E. Torres on Nov 22, 2025",
    regulatoryReferences: ["OSHA 1910.38", "API RP 75"],
    aiConfidence: "High", aiReason: "Direct match to H&P drill frequency requirements.",
    status: "pending", hpPercent: 92, kcadPercent: 8,
  },
  {
    id: "p15", sectionId: "s3",
    text: "In the event of a fire on the rig floor, the driller is responsible for initiating the ESD system and sounding the general alarm. The Rig Manager assumes overall command of the emergency response.",
    sourceDocument: "H&P Emergency Action Plan", origin: "H&P",
    applicability: "Applies to: All Land Rigs",
    lastVerified: "Reviewed by E. Torres on Nov 22, 2025",
    regulatoryReferences: ["OSHA 1910.38"],
    aiConfidence: "High", aiReason: "Direct match to H&P fire emergency protocols.",
    status: "pending", hpPercent: 100, kcadPercent: 0,
  },
  {
    id: "p16", sectionId: "s3",
    text: "Medevac procedures must be reviewed at the start of each hitch. The nearest medical facility, helicopter landing coordinates, and emergency contact numbers must be current and posted in the toolpusher's office and the medic station.",
    sourceDocument: "KCAD Global HSE Standard", origin: "KCAD",
    applicability: "Applies to: All Locations",
    lastVerified: "Reviewed by M. Davis on Sep 01, 2025",
    regulatoryReferences: [],
    aiConfidence: "Medium", aiReason: "Medevac details vary by location — verify coordinates are current.",
    status: "pending", hpPercent: 30, kcadPercent: 70,
  },
  {
    id: "p17", sectionId: "s3",
    text: "All emergency response equipment including fire extinguishers, life rafts, breathing apparatus, and first aid kits must be inspected weekly. Deficiencies must be corrected before the next operational shift begins.",
    sourceDocument: "KCAD Equipment Requirements", origin: "KCAD",
    applicability: "Applies to: Offshore & Critical Land Rigs",
    lastVerified: "Reviewed by T. Nguyen on Feb 05, 2026",
    regulatoryReferences: ["OSHA 1910.157", "API RP 14G"],
    aiConfidence: "High", aiReason: "Standard emergency equipment inspection requirement.",
    status: "pending", hpPercent: 18, kcadPercent: 82,
  },
];

export function ReviewScreen() {
  const navigate = useNavigate();
  const [paragraphs, setParagraphs] = useState<ParagraphData[]>(INITIAL_PARAGRAPHS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>(SECTIONS[0].id);
  const [calloutTopPx, setCalloutTopPx] = useState(0);

  // Connector line coordinates
  const [lineCoords, setLineCoords] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [lineVisible, setLineVisible] = useState(false);

  const paragraphRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const centerRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const threeColRef = useRef<HTMLDivElement>(null);
  const calloutCardRef = useRef<HTMLDivElement>(null);

  // ── IntersectionObserver for active section tracking ──
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

    SECTIONS.forEach(s => {
      const el = sectionRefs.current[s.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // ── Scroll to section on left-nav click ──
  const scrollToSection = useCallback((sectionId: string) => {
    const el = sectionRefs.current[sectionId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // ── Recalculate connector line positions ──
  const recalcLine = useCallback(() => {
    if (!activeId) { setLineCoords(null); return; }
    const pEl = paragraphRefs.current[activeId];
    const container = threeColRef.current;
    const calloutCard = calloutCardRef.current;
    if (!pEl || !container || !calloutCard) { setLineCoords(null); return; }

    const containerRect = container.getBoundingClientRect();
    const pRect = pEl.getBoundingClientRect();
    const cRect = calloutCard.getBoundingClientRect();

    // From: right edge of paragraph, vertical center
    const x1 = pRect.right - containerRect.left;
    const y1 = pRect.top + pRect.height / 2 - containerRect.top;
    // To: left edge of callout card, vertical top + 20px
    const x2 = cRect.left - containerRect.left;
    const y2 = cRect.top + 20 - containerRect.top;

    setLineCoords({ x1, y1, x2, y2 });
  }, [activeId]);

  // ── Show/hide line on activeId change ──
  useEffect(() => {
    if (activeId) {
      setLineVisible(false);
      // Small delay to let callout render, then calc + show
      const t = setTimeout(() => {
        recalcLine();
        setLineVisible(true);
      }, 60);
      return () => clearTimeout(t);
    } else {
      setLineVisible(false);
      const fadeTimer = setTimeout(() => setLineCoords(null), 160);
      return () => clearTimeout(fadeTimer);
    }
  }, [activeId, recalcLine]);

  // ── Recalc on scroll and resize ──
  useEffect(() => {
    const scrollEl = centerRef.current;
    const handleRecalc = () => { if (activeId) recalcLine(); };
    scrollEl?.addEventListener("scroll", handleRecalc, { passive: true });
    window.addEventListener("resize", handleRecalc);
    return () => {
      scrollEl?.removeEventListener("scroll", handleRecalc);
      window.removeEventListener("resize", handleRecalc);
    };
  }, [activeId, recalcLine]);

  // ── Paragraph click — calculate callout vertical position ──
  const handleParagraphClick = (id: string, e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (activeId === id) {
      setActiveId(null);
      return;
    }
    const el = paragraphRefs.current[id];
    const rightCol = rightColRef.current;
    if (el && rightCol) {
      const rightColRect = rightCol.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      let desiredTop = elRect.top - rightColRect.top;
      desiredTop = Math.max(0, desiredTop);
      const maxTop = rightColRect.height - 380;
      if (maxTop > 0 && desiredTop > maxTop) {
        desiredTop = maxTop;
      }
      setCalloutTopPx(desiredTop);
    }
    setActiveId(id);
  };

  const handleApprove = (id: string) => {
    setParagraphs(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
    setActiveId(null);
  };

  const handleReject = (id: string, reason?: string) => {
    setParagraphs(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected', rejectReason: reason } : p));
    setActiveId(null);
  };

  const selectedParagraph = paragraphs.find(p => p.id === activeId);

  // ── Per-section review progress ──
  const sectionProgress = (sectionId: string) => {
    const sectionParas = paragraphs.filter(p => p.sectionId === sectionId);
    const reviewed = sectionParas.filter(p => p.status === 'approved' || p.status === 'rejected').length;
    return { reviewed, total: sectionParas.length };
  };

  // Stepper progress
  const activeStepIdx = REVIEWERS.findIndex(r => r.status === "active");

  // SVG bezier path
  const connectorPath = lineCoords
    ? `M ${lineCoords.x1},${lineCoords.y1} C ${lineCoords.x1 + 80},${lineCoords.y1} ${lineCoords.x2 - 80},${lineCoords.y2} ${lineCoords.x2},${lineCoords.y2}`
    : "";
  const pathLength = lineCoords
    ? Math.sqrt(Math.pow(lineCoords.x2 - lineCoords.x1, 2) + Math.pow(lineCoords.y2 - lineCoords.y1, 2)) * 1.3
    : 0;

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-page)", fontFamily: "Inter, sans-serif" }}
    >
      <style>{REVIEW_STYLES}</style>

      <Header breadcrumb="Review Document" showOnlineStatus={true} showUser={true} />

      {/* ═══ Stepper Bar ═══ */}
      <div
        className="w-full shrink-0 px-6 py-4 flex flex-col gap-3"
        style={{
          backgroundColor: "var(--bg-card)",
          borderBottom: "var(--border-default)",
        }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-[12px] font-bold uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}
          >
            Review Pipeline
          </span>
          <span className="text-[12px] font-medium" style={{ color: "var(--text-tertiary)" }}>
            Rig Titan — Houston, TX — Pre-Job Drilling
          </span>
        </div>

        <div className="flex items-center">
          {REVIEWERS.map((reviewer, idx) => {
            const isCompleted = reviewer.status === "completed";
            const isActive = reviewer.status === "active";
            const isPending = reviewer.status === "pending";

            return (
              <div key={reviewer.name} className="flex items-center">
                {idx > 0 && (
                  <div className="relative mx-3" style={{ width: 48, height: 2 }}>
                    <div className="absolute inset-0 rounded-full" style={{ backgroundColor: "var(--bg-hover)" }} />
                    <div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        width: idx <= activeStepIdx ? "100%" : "0%",
                        backgroundColor: "var(--color-positive)",
                        transition: "width 300ms ease-out",
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2.5">
                  {isCompleted && (
                    <div
                      className="w-[22px] h-[22px] rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--color-positive-bg)" }}
                    >
                      <Check className="w-[14px] h-[14px]" style={{ color: "var(--color-positive)" }} />
                    </div>
                  )}
                  {isActive && (
                    <div
                      className="stepper-active-dot w-[22px] h-[22px] rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--color-brand)" }}
                    >
                      <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: "var(--text-on-primary)" }} />
                    </div>
                  )}
                  {isPending && (
                    <div
                      className="w-[22px] h-[22px] rounded-full"
                      style={{ border: "2px solid var(--text-muted)", opacity: 0.5 }}
                    />
                  )}

                  <div className="flex flex-col">
                    <span
                      className="text-[13px] font-semibold leading-tight"
                      style={{
                        color: isActive ? "var(--color-brand)" : isCompleted ? "var(--text-primary)" : "var(--text-muted)",
                        fontWeight: isActive ? 700 : 600,
                      }}
                    >
                      {reviewer.name}
                    </span>
                    <span
                      className="text-[12px] leading-tight"
                      style={{
                        color: isActive ? "var(--color-brand)" : "var(--text-tertiary)",
                        opacity: isPending ? 0.5 : 1,
                      }}
                    >
                      {reviewer.role}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ Three Column Layout ═══ */}
      <div ref={threeColRef} className="flex-1 flex overflow-hidden relative">

        {/* ── SVG Connector Line Overlay ── */}
        {lineCoords && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 10 }}
          >
            <path
              d={connectorPath}
              fill="none"
              stroke="var(--color-brand)"
              strokeWidth="1.5"
              strokeOpacity={lineVisible ? 0.5 : 0}
              strokeDasharray={pathLength}
              strokeDashoffset={lineVisible ? 0 : pathLength}
              style={{
                transition: lineVisible
                  ? "stroke-dashoffset 350ms ease-out, stroke-opacity 200ms ease-out"
                  : "stroke-opacity 150ms ease-out",
              }}
            />
          </svg>
        )}

        {/* ── Column 1: Section Navigation (Left, Fixed 220px) ── */}
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
            style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}
          >
            In This Document
          </span>

          <nav className="flex flex-col gap-1">
            {SECTIONS.map(section => {
              const isActive = activeSectionId === section.id;
              const progress = sectionProgress(section.id);
              const label = section.title.replace(/^\d+\.\s*/, "");

              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="text-left px-3 py-2.5 rounded-[6px] transition-all duration-150 flex items-start justify-between gap-2"
                  style={{
                    backgroundColor: isActive ? "var(--bg-hover)" : "transparent",
                    borderLeft: isActive ? "3px solid var(--color-brand)" : "3px solid transparent",
                  }}
                >
                  <span
                    className="text-[13px] leading-tight"
                    style={{
                      color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    className="text-[12px] font-semibold shrink-0 mt-0.5"
                    style={{
                      color: progress.reviewed === progress.total && progress.total > 0
                        ? "var(--color-positive)"
                        : "var(--text-muted)",
                    }}
                  >
                    {progress.reviewed} / {progress.total}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Column 2: Document Body (Center, Scrollable) ── */}
        <div
          className="flex-1 overflow-y-auto px-8 py-8"
          ref={centerRef}
          onClick={() => setActiveId(null)}
        >
          <div className="max-w-[800px] mx-auto flex flex-col gap-8">
            {SECTIONS.map(section => (
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
                  {paragraphs.filter(p => p.sectionId === section.id).map((p) => {
                    const isActive = activeId === p.id;
                    const isApproved = p.status === "approved";
                    const isRejected = p.status === "rejected";

                    let leftBorderColor = "transparent";
                    if (isActive) leftBorderColor = "var(--color-brand)";
                    else if (isApproved) leftBorderColor = "var(--color-positive)";
                    else if (isRejected) leftBorderColor = "var(--color-negative)";

                    let bgColor = "transparent";
                    if (isActive) bgColor = "var(--bg-hover)";
                    else if (isApproved) bgColor = "var(--color-positive-bg)";
                    else if (isRejected) bgColor = "var(--color-error-bg)";

                    return (
                      <div
                        key={p.id}
                        ref={(el) => { paragraphRefs.current[p.id] = el; }}
                        onClick={(e) => handleParagraphClick(p.id, e)}
                        className="cursor-pointer relative group"
                        style={{
                          padding: "16px 24px 16px 20px",
                          borderLeft: `4px solid ${leftBorderColor}`,
                          backgroundColor: bgColor,
                          borderBottom: "none",
                          transition: "background-color 150ms ease-in, border-color 200ms ease-out",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive && !isApproved && !isRejected) {
                            e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                            e.currentTarget.style.borderLeftColor = "var(--color-brand)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive && !isApproved && !isRejected) {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.borderLeftColor = "transparent";
                          }
                        }}
                      >
                        <div className="flex items-start gap-2">
                          {isApproved && (
                            <Check
                              className="w-[16px] h-[16px] shrink-0 mt-0.5"
                              style={{
                                color: "var(--color-positive)",
                                animation: "fadeIn 200ms ease-out",
                              }}
                            />
                          )}
                          <span
                            className="text-[15px] leading-relaxed"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {p.text}
                          </span>
                        </div>

                        {isRejected && p.rejectReason && (
                          <div
                            className="mt-3 text-[13px] font-medium p-2.5 rounded-[6px]"
                            style={{
                              color: "var(--color-negative)",
                              backgroundColor: "var(--color-error-bg)",
                              border: "1px solid var(--color-negative)",
                            }}
                          >
                            <span className="font-bold">Rejection Reason: </span>
                            {p.rejectReason}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="h-[200px]" />
          </div>
        </div>

        {/* ── Column 3: Annotation Panel (Right, Fixed 320px) ── */}
        <div
          ref={rightColRef}
          className="shrink-0 flex flex-col overflow-hidden"
          style={{
            width: 320,
            borderLeft: "var(--border-default)",
            backgroundColor: "var(--bg-page)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Top Zone: AI Confidence (static, pinned) ── */}
          <AIConfidenceCard data={selectedParagraph || null} />

          {/* ── Bottom Zone: Annotation Details (flexible, scrollable) ── */}
          <div className="flex-1 overflow-y-auto relative">
            {selectedParagraph ? (
              <div
                ref={calloutCardRef}
                className="p-3"
              >
                <AnnotationCallout
                  data={selectedParagraph}
                  onApprove={() => handleApprove(selectedParagraph.id)}
                  onReject={(reason) => handleReject(selectedParagraph.id, reason)}
                  onClose={() => setActiveId(null)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 px-6">
                <FileSearch
                  className="w-[32px] h-[32px]"
                  style={{ color: "var(--text-muted)", opacity: 0.5 }}
                />
                <p
                  className="text-[13px] text-center leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  Select a paragraph to see its source details
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      <StickyFooter justify="between">
        <FooterButton
          label="Back"
          icon={<ArrowLeft className="w-[14px] h-[14px]" />}
          variant="secondary"
          onClick={() => navigate("/scope")}
        />
      </StickyFooter>
    </div>
  );
}

