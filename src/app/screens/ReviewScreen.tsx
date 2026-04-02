import { useState, useRef, useEffect, useCallback, MouseEvent } from "react";
import { Header } from "../components/Header";
import { StickyFooter, FooterButton } from "../components/StickyFooter";
import { ArrowLeft, Check, FileSearch, Pencil } from "lucide-react";
import { AnnotationCallout, AIConfidenceCard, ParagraphData } from "../components/AnnotationCallout";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Badge } from "../components/ui/badge";

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
  { nameKey: "reviewer1", roleKey: "roleMgr", status: "completed" as const },
  { nameKey: "reviewer2", roleKey: "roleSrMgr", status: "active" as const },
  { nameKey: "reviewer3", roleKey: "roleMgr", status: "pending" as const },
];

const SECTIONS = [
  { id: "s1", title: "1. Purpose & Scope" },
  { id: "s2", title: "2. Hazard Identification & Controls" },
  { id: "s3", title: "3. Emergency Response" },
];

const PARAGRAPH_EXTRAS: Record<string, { sourceDocumentUrl: string; excludedExcerpts: string[] }> = {
  p1: {
    sourceDocumentUrl: "/documents/hp/HP-Well-Control-Manual-v4.2.pdf",
    excludedExcerpts: [
      "As an alternative to the procedures described herein, an Operator may use equivalent equipment or methods, provided such equivalency is demonstrated through documented risk assessment and approved by the Drilling Engineer of Record prior to deployment.",
      "This document is subject to periodic review by the H&P Well Control Review Board and will be updated to reflect changes to API Recommended Practice 53, IADC Well Control Guidelines, and applicable governmental regulations.",
    ],
  },
  p2: {
    sourceDocumentUrl: "/documents/kcad/KCAD-Global-HSE-Standard.pdf",
    excludedExcerpts: [
      "Legacy KCAD procedures from the K-CW 002 Health and Safety series shall remain in force for Kazakhstan operations until the transition period concludes on 31 December 2025, after which this consolidated document supersedes all predecessor documents.",
      "Compliance verification shall be conducted by an independent third-party auditor not less than once every 24 months, and following any significant operational incident classified as Tier 1 or above under the KCAD Incident Classification Matrix.",
    ],
  },
  p3: {
    sourceDocumentUrl: "/documents/hp/HP-Well-Control-Manual-v4.2.pdf",
    excludedExcerpts: [
      "Operations conducted under temporary variance authorizations, including deviation from standard well control procedures during well testing or production testing phases, shall be governed by a separately approved site-specific well control plan.",
      "Contractor personnel engaged in well control operations must hold current IADC WellCAP certification at the Supervisory level or equivalent as approved by the H&P Drilling Manager. Certification records shall be maintained in the crew competency register.",
    ],
  },
  p4: {
    sourceDocumentUrl: "/documents/kcad/KCAD-Global-HSE-Standard.pdf",
    excludedExcerpts: [
      "Personnel classified as visitors or short-term site guests on-site for fewer than 4 hours are exempt from the full induction requirement but must receive a site-specific safety briefing not exceeding 15 minutes upon arrival.",
      "Deviation from any mandatory compliance requirement contained herein requires formal Management of Change approval at the Regional HSE Director level and must be communicated to the relevant regulatory authority within 72 hours.",
    ],
  },
  p5: {
    sourceDocumentUrl: "/documents/hp/HP-Well-Control-Manual-v4.2.pdf",
    excludedExcerpts: [
      "For operations conducted under active production sharing agreements, any variance from this standard identified as potentially conflicting with the host government's mandatory well control regulations must be escalated to the Drilling Manager and Legal department for review prior to operations.",
      "Where third-party clients impose supplementary well control requirements through their own Technical Standards, these shall be reviewed against the provisions of this document by a qualified Well Control Specialist and a bridging document prepared where necessary.",
    ],
  },
  p6: {
    sourceDocumentUrl: "/documents/hp/HP-Operations-Manual.pdf",
    excludedExcerpts: [
      "In wells with elevated formation pressure gradients or where a SICP greater than 300 psi has been recorded within the preceding 48 hours, the trip sheet verification frequency shall be increased to every 3 stands rather than the standard 5-stand interval.",
      "The Mud Engineer shall ensure that all trip tank volumes are recorded in real-time drilling data systems and that any manual override of automated fill-up calculations is documented with written justification in the drilling report.",
    ],
  },
  p7: {
    sourceDocumentUrl: "/documents/kcad/Merged-Safety-Guidelines.pdf",
    excludedExcerpts: [
      "The volumetric well control method may be applied where wellbore geometry or drill string configuration prevents circulation. Application of this method requires express authorization from the Drilling Engineer and shall be documented in the post-well kick report.",
      "Surface shut-in pressure readings shall be taken no later than 30 minutes after initial well shut-in to establish stable SIDP and SICP values for kick analysis. Readings taken before pressure stabilization must be annotated as preliminary in the well control report.",
    ],
  },
  p8: {
    sourceDocumentUrl: "/documents/hp/HP-Operations-Manual.pdf",
    excludedExcerpts: [
      "BOP function tests shall include both manual and remote operation of all available closing units. Where remote actuation equipment is found to be inoperative, drilling operations shall be suspended until full remote capability is restored and verified.",
      "Accumulator pre-charge pressures shall be verified against the manufacturer's specifications at the start of each hitch. Any deviation from the specified pre-charge range shall result in immediate investigation by the Rig Mechanic before operations continue.",
    ],
  },
  p9: {
    sourceDocumentUrl: "/documents/kcad/KCAD-Global-HSE-Standard.pdf",
    excludedExcerpts: [
      "Fixed-point H₂S monitoring sensors shall be calibrated in accordance with the manufacturer's schedule or a minimum of once per calendar quarter, whichever is more frequent. Calibration records must be maintained and available for regulatory inspection.",
      "In the event of a continuous H₂S reading exceeding 10 ppm at any monitoring station, all non-essential personnel shall evacuate the affected zone immediately. Operations may only resume after H₂S readings return to below 1 ppm for a sustained period of 15 minutes.",
    ],
  },
  p10: {
    sourceDocumentUrl: "/documents/hp/HP-Operations-Manual.pdf",
    excludedExcerpts: [
      "Mud weight adjustments of more than 0.5 ppg shall only be authorized by the Drilling Engineer and shall be preceded by a formal review of the current pore pressure prediction and wellbore stability analysis.",
      "The Mud Engineer shall prepare a daily mud report summarizing actual versus planned mud weight, rheology data, and any chemical treatments applied. This report must be signed by the Company Man before being transmitted to the operations office.",
    ],
  },
  p11: {
    sourceDocumentUrl: "/documents/kcad/KCAD-Global-HSE-Standard.pdf",
    excludedExcerpts: [
      "Permits to work for tasks within the rotating equipment exclusion zone must specifically identify the equipment involved, the nature of the task, and the isolation measures in place. Generic PTW templates that do not reference specific equipment are not acceptable.",
      "Following any incident or near miss involving rotating equipment, the affected equipment shall be subject to a formal Post-Incident Inspection before being returned to service. A copy of the inspection report shall be forwarded to the KCAD Equipment Integrity team within 5 business days.",
    ],
  },
  p12: {
    sourceDocumentUrl: "/documents/hp/HP-Emergency-Action-Plan.pdf",
    excludedExcerpts: [
      "Personnel with mobility restrictions or physical impairments requiring evacuation assistance shall be identified on the Emergency Accommodation List maintained by the Rig Manager. Designated personnel shall be assigned to assist these individuals during emergency mustering.",
      "The Emergency Response Coordinator shall maintain a headcount until all personnel are accounted for at their designated muster station. No personnel may return to their work area until the Rig Manager issues an all-clear via the site PA system.",
    ],
  },
  p13: {
    sourceDocumentUrl: "/documents/kcad/KCAD-Equipment-Requirements.pdf",
    excludedExcerpts: [
      "Accumulator capacity calculations shall be performed using the actual BOP closing ratios verified during the most recent full BOP pressure test. Calculations based on nominal or design values without field verification are not acceptable.",
      "A secondary hydraulic accumulator system with independent pressure supply must be installed and maintained at full operational status on all HPHT well operations where bottomhole pressures exceed 10,000 psi, regardless of rig vintage or existing equipment certification status.",
    ],
  },
  p14: {
    sourceDocumentUrl: "/documents/hp/HP-Emergency-Action-Plan.pdf",
    excludedExcerpts: [
      "Tabletop emergency response exercises shall be conducted at the start of each hitch in addition to physical drills, covering well control, fire, and H₂S release scenarios on a rotating basis.",
      "Records of emergency drills, including attendance sheets, observer notes, and corrective actions arising from drill debriefs, shall be retained in the site HSE file for a minimum of 24 months and be available for review during regulatory inspections.",
    ],
  },
  p15: {
    sourceDocumentUrl: "/documents/hp/HP-Emergency-Action-Plan.pdf",
    excludedExcerpts: [
      "In facilities where a deluge or fixed suppression system is installed, activation of the ESD shall automatically trigger suppression system flow to the affected zone. Manual override of automatic suppression activation is only permitted by the Rig Manager in consultation with the HSE Representative.",
      "Post-incident fire investigation reports shall be completed within 5 working days using the H&P Incident Investigation template (Form HSE-INV-001). Root cause analysis must identify contributing organizational factors in addition to immediate physical causes.",
    ],
  },
  p16: {
    sourceDocumentUrl: "/documents/kcad/KCAD-Global-HSE-Standard.pdf",
    excludedExcerpts: [
      "Medevac authorization protocols shall include pre-designated decision trees specifying which injuries or medical conditions mandate immediate helicopter evacuation versus land transport. These protocols shall be reviewed by a qualified medical professional prior to each major drilling campaign.",
      "Where satellite communication equipment is the primary means of emergency communication, a secondary method such as HF radio must be tested at least once per week and the test documented in the communication log.",
    ],
  },
  p17: {
    sourceDocumentUrl: "/documents/kcad/KCAD-Equipment-Requirements.pdf",
    excludedExcerpts: [
      "Breathing apparatus inspection records shall include the unique serial number of each unit, the inspector's name and qualification, the test pressure achieved, and the estimated remaining service life of each component, countersigned by the HSE Representative.",
      "Life raft and life ring inspections shall be conducted by a third-party marine safety specialist holding a current qualification recognized by the applicable flag state authority. Self-certification of life-saving appliances is not permitted on offshore operations.",
    ],
  },
};

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
    status: "auto-approved", hpPercent: 98, kcadPercent: 2,
    aiConfidenceScore: 98,
    sources: [
      { documentName: "H&P Well Control Manual v4.2", origin: "H&P", percentage: 98 },
      { documentName: "KCAD Global HSE Standard", origin: "KCAD", percentage: 2 }
    ]
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
    aiConfidenceScore: 75,
    sources: [
      { documentName: "KCAD Global HSE Standard", origin: "KCAD", percentage: 75 },
      { documentName: "H&P Operations Manual", origin: "H&P", percentage: 25 }
    ]
  },
  {
    id: "p3", sectionId: "s1",
    text: "This document applies to all H&P drilling operations conducted under the jurisdiction of this rig assignment, including but not limited to: rotary drilling, tripping, cementing, logging, and well intervention activities.",
    sourceDocument: "H&P Well Control Manual v4.2", origin: "H&P",
    applicability: "Applies to: All Land Rigs",
    lastVerified: "Reviewed by J. Smith on Oct 12, 2025",
    regulatoryReferences: ["API RP 53"],
    aiConfidence: "High", aiReason: "Direct match to H&P source with no conflicts.",
    status: "auto-approved", hpPercent: 100, kcadPercent: 0,
    aiConfidenceScore: 100,
    sources: [
      { documentName: "H&P Well Control Manual v4.2", origin: "H&P", percentage: 100 }
    ]
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
    aiConfidenceScore: 80,
    sources: [
      { documentName: "KCAD Global HSE Standard", origin: "KCAD", percentage: 80 },
      { documentName: "H&P Well Control Manual v4.2", origin: "H&P", percentage: 20 }
    ]
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
    aiConfidenceScore: 85,
    sources: [
      { documentName: "H&P Well Control Manual v4.2", origin: "H&P", percentage: 85 },
      { documentName: "KCAD Global HSE Standard", origin: "KCAD", percentage: 15 }
    ]
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
    aiConfidenceScore: 72,
    sources: [
      { documentName: "H&P Operations Manual", origin: "H&P", percentage: 72 },
      { documentName: "Merged Safety Guidelines", origin: "KCAD", percentage: 28 }
    ]
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
    aiConfidenceScore: 55,
    sources: [
      { documentName: "Merged Safety Guidelines", origin: "KCAD", percentage: 55 },
      { documentName: "H&P Operations Manual", origin: "H&P", percentage: 45 }
    ]
  },
  {
    id: "p8", sectionId: "s2",
    text: "Prior to each drilling shift, the driller must verify that all BOP functions are operational and that the accumulator pressure is within the specified operating range. Any anomaly must be reported to the Rig Manager immediately and logged in the daily drilling report.",
    sourceDocument: "H&P Operations Manual", origin: "H&P",
    applicability: "Applies to: All Land Rigs",
    lastVerified: "Reviewed by A. Lewis on Jan 14, 2026",
    regulatoryReferences: ["API RP 53"],
    aiConfidence: "High", aiReason: "Direct match to H&P BOP verification protocols.",
    status: "auto-approved", hpPercent: 95, kcadPercent: 5,
    aiConfidenceScore: 95,
    sources: [
      { documentName: "H&P Operations Manual", origin: "H&P", percentage: 95 },
      { documentName: "KCAD Equipment Requirements", origin: "KCAD", percentage: 5 }
    ]
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
    aiConfidenceScore: 85,
    sources: [
      { documentName: "KCAD Global HSE Standard", origin: "KCAD", percentage: 85 },
      { documentName: "H&P Operations Manual", origin: "H&P", percentage: 15 }
    ]
  },
  {
    id: "p10", sectionId: "s2",
    text: "Drilling fluid weight must be maintained within the approved mud weight window at all times. Any deviation of more than 0.2 ppg from the planned mud weight requires immediate notification to the Drilling Engineer and Sr. QHSC Manager before operations continue.",
    sourceDocument: "H&P Operations Manual", origin: "H&P",
    applicability: "Applies to: All Land Rigs",
    lastVerified: "Reviewed by A. Lewis on Jan 14, 2026",
    regulatoryReferences: [],
    aiConfidence: "High", aiReason: "Direct match to H&P mud weight management procedures.",
    status: "auto-approved", hpPercent: 97, kcadPercent: 3,
    aiConfidenceScore: 97,
    sources: [
      { documentName: "H&P Operations Manual", origin: "H&P", percentage: 97 },
      { documentName: "KCAD Global HSE Standard", origin: "KCAD", percentage: 3 }
    ]
  },
  {
    id: "p11", sectionId: "s2",
    text: "Rotating equipment guards must be inspected at the beginning of each shift. No personnel are permitted within the rotating envelope during active drilling operations unless a formal permit to work has been issued.",
    sourceDocument: "KCAD Global HSE Standard", origin: "KCAD",
    applicability: "Applies to: All Locations",
    lastVerified: "Reviewed by M. Davis on Sep 01, 2025",
    regulatoryReferences: ["OSHA 1910.219"],
    aiConfidence: "High", aiReason: "Standard rotating equipment safety requirement.",
    status: "auto-approved", hpPercent: 10, kcadPercent: 90,
    aiConfidenceScore: 90,
    sources: [
      { documentName: "KCAD Global HSE Standard", origin: "KCAD", percentage: 90 },
      { documentName: "H&P Operations Manual", origin: "H&P", percentage: 10 }
    ]
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
    status: "auto-approved", hpPercent: 96, kcadPercent: 4,
    aiConfidenceScore: 96,
    sources: [
      { documentName: "H&P Emergency Action Plan", origin: "H&P", percentage: 96 },
      { documentName: "KCAD Global HSE Standard", origin: "KCAD", percentage: 4 }
    ]
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
    aiConfidenceScore: 88,
    sources: [
      { documentName: "KCAD Equipment Requirements", origin: "KCAD", percentage: 88 },
      { documentName: "H&P Well Control Manual v4.2", origin: "H&P", percentage: 12 }
    ]
  },
  {
    id: "p14", sectionId: "s3",
    text: "Emergency shutdown procedures must be posted at the driller's console, the doghouse entrance, and at each muster point. All crew members must complete emergency response drills at a minimum frequency of once per 14-day hitch.",
    sourceDocument: "H&P Emergency Action Plan", origin: "H&P",
    applicability: "Applies to: All Land Rigs",
    lastVerified: "Reviewed by E. Torres on Nov 22, 2025",
    regulatoryReferences: ["OSHA 1910.38", "API RP 75"],
    aiConfidence: "High", aiReason: "Direct match to H&P drill frequency requirements.",
    status: "auto-approved", hpPercent: 92, kcadPercent: 8,
    aiConfidenceScore: 92,
    sources: [
      { documentName: "H&P Emergency Action Plan", origin: "H&P", percentage: 92 },
      { documentName: "KCAD Global HSE Standard", origin: "KCAD", percentage: 8 }
    ]
  },
  {
    id: "p15", sectionId: "s3",
    text: "In the event of a fire on the rig floor, the driller is responsible for initiating the ESD system and sounding the general alarm. The Rig Manager assumes overall command of the emergency response.",
    sourceDocument: "H&P Emergency Action Plan", origin: "H&P",
    applicability: "Applies to: All Land Rigs",
    lastVerified: "Reviewed by E. Torres on Nov 22, 2025",
    regulatoryReferences: ["OSHA 1910.38"],
    aiConfidence: "High", aiReason: "Direct match to H&P fire emergency protocols.",
    status: "auto-approved", hpPercent: 100, kcadPercent: 0,
    aiConfidenceScore: 100,
    sources: [
      { documentName: "H&P Emergency Action Plan", origin: "H&P", percentage: 100 }
    ]
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
    aiConfidenceScore: 70,
    sources: [
      { documentName: "KCAD Global HSE Standard", origin: "KCAD", percentage: 60 },
      { documentName: "H&P Operations Manual", origin: "H&P", percentage: 30 },
      { documentName: "KCAD Equipment Requirements", origin: "KCAD", percentage: 10 }
    ]
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
    aiConfidenceScore: 82,
    sources: [
      { documentName: "KCAD Equipment Requirements", origin: "KCAD", percentage: 82 },
      { documentName: "H&P Operations Manual", origin: "H&P", percentage: 18 }
    ]
  },
].map(p => ({ ...p, ...(PARAGRAPH_EXTRAS[p.id] ?? {}) })) as ParagraphData[];

export function ReviewScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [paragraphs, setParagraphs] = useState<ParagraphData[]>(INITIAL_PARAGRAPHS);

  const [activeId, setActiveId] = useState<string | null>(null);
  const isAllReviewed = paragraphs.length > 0 && paragraphs.every(p => p.status !== 'pending');
  const [activeSectionId, setActiveSectionId] = useState<string>(SECTIONS[0].id);
  const [calloutTopPx, setCalloutTopPx] = useState(0);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const editAreaRef = useRef<HTMLTextAreaElement>(null);

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

  const startEditing = (p: ParagraphData, e: MouseEvent) => {
    e.stopPropagation();
    if (editingId && editingId !== p.id) {
      if (!window.confirm("You have unsaved changes. Discard them?")) return;
    }
    setEditingId(p.id);
    setEditingText(p.text);
    setActiveId(p.id);

    // Give react a tick to render text area, then auto resize
    requestAnimationFrame(() => {
      if (editAreaRef.current) {
        editAreaRef.current.style.height = "auto";
        editAreaRef.current.style.height = editAreaRef.current.scrollHeight + "px";
        const len = editAreaRef.current.value.length;
        editAreaRef.current.setSelectionRange(len, len);
      }
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    setParagraphs(prev => prev.map(p => {
      if (p.id === editingId) {
        return {
          ...p,
          text: editingText,
          isEdited: true,
          originalText: p.originalText ?? p.text
        };
      }
      return p;
    }));
    setEditingId(null);
  };

  const discardEdit = () => {
    setEditingId(null);
  };

  const handleRevert = (id: string) => {
    setParagraphs(prev => prev.map(p => {
      if (p.id === id && p.isEdited) {
        return {
          ...p,
          text: p.originalText || p.text,
          isEdited: false
        };
      }
      return p;
    }));
  };

  const selectedParagraph = paragraphs.find(p => p.id === activeId);

  // ── Per-section review progress ──
  const sectionProgress = (sectionId: string) => {
    const sectionParas = paragraphs.filter(p => p.sectionId === sectionId);
    const reviewed = sectionParas.filter(p => p.status === 'approved' || p.status === 'rejected' || p.status === 'auto-approved').length;
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

      <Header
        breadcrumb={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Scope", path: "/scope" },
          { label: "Review" }
        ]}
        showOnlineStatus={true}
        showUser={true}
      />

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
            {t("review.reviewPipeline")}
          </span>
          <span className="text-[12px] font-medium" style={{ color: "var(--text-tertiary)" }}>
            {t("review.rigTitan")}
          </span>
        </div>

        <div className="flex items-center">
          {REVIEWERS.map((reviewer, idx) => {
            const isCompleted = reviewer.status === "completed";
            const isActive = reviewer.status === "active";
            const isPending = reviewer.status === "pending";

            return (
              <div key={reviewer.nameKey} className="flex items-center">
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
                      {t(`review.${reviewer.nameKey}`)}
                    </span>
                    <span
                      className="text-[12px] leading-tight"
                      style={{
                        color: isActive ? "var(--color-brand)" : "var(--text-tertiary)",
                        opacity: isPending ? 0.5 : 1,
                      }}
                    >
                      {t(`review.${reviewer.roleKey}`)}
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
            {t("review.inThisDocument")}
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
                    const isAutoApproved = p.status === "auto-approved";

                    let leftBorderColor = "transparent";
                    if (isActive) leftBorderColor = "var(--color-brand)";
                    else if (isApproved || isAutoApproved) leftBorderColor = "var(--color-positive)";
                    else if (isRejected) leftBorderColor = "var(--color-negative)";

                    let bgColor = "transparent";
                    if (isActive) bgColor = "var(--bg-hover)";
                    else if (isApproved) bgColor = "var(--color-positive-bg)";
                    else if (isAutoApproved) bgColor = "transparent";
                    else if (isRejected) bgColor = "var(--color-error-bg)";

                    return (
                      <div
                        key={p.id}
                        ref={(el) => { paragraphRefs.current[p.id] = el; }}
                        onClick={(e) => handleParagraphClick(p.id, e)}
                        className="relative group"
                        style={{
                          padding: "16px 24px 16px 20px",
                          borderLeft: `4px solid ${leftBorderColor}`,
                          backgroundColor: bgColor,
                          borderBottom: "none",
                          transition: "background-color 150ms ease-in, border-color 200ms ease-out",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive && !isApproved && !isRejected && !isAutoApproved) {
                            e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                            e.currentTarget.style.borderLeftColor = "var(--color-brand)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive && !isApproved && !isRejected && !isAutoApproved) {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.borderLeftColor = "transparent";
                          }
                        }}
                      >
                        {/* Edit Button */}
                        {editingId !== p.id && (
                          <button
                            onClick={(e) => startEditing(p, e)}
                            className="absolute right-4 top-4 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            style={{ color: "var(--text-muted)", backgroundColor: "var(--bg-hover)" }}
                          >
                            <Pencil className="w-[14px] h-[14px]" />
                          </button>
                        )}

                        <div className="flex flex-col gap-1.5 w-full pr-10">
                          {isAutoApproved && (
                            <Badge
                              variant="outline"
                              className="text-[10px] h-5 font-semibold px-2 mb-1 self-start"
                              style={{
                                backgroundColor: "transparent",
                                color: "var(--color-positive)",
                                borderColor: "rgba(17,104,68,0.25)",
                                borderStyle: "dashed",
                              }}
                            >
                              Auto-approved by AI
                            </Badge>
                          )}

                          {p.isEdited && (
                            <span 
                              className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] self-start" 
                              style={{ backgroundColor: "var(--bg-hover)", color: "var(--text-muted)" }}
                            >
                              {t("review.edited")}
                            </span>
                          )}

                          <div className="flex items-start gap-2 w-full">
                            {(isApproved || isAutoApproved) && (
                              <Check
                                className="w-[16px] h-[16px] shrink-0 mt-0.5"
                                style={{
                                  color: "var(--color-positive)",
                                  animation: "fadeIn 200ms ease-out",
                                }}
                              />
                            )}

                            {editingId === p.id ? (
                              <div className="flex flex-col w-full gap-3">
                                <textarea
                                  ref={editAreaRef}
                                  value={editingText}
                                  onChange={(e) => {
                                    setEditingText(e.target.value);
                                    e.target.style.height = "auto";
                                    e.target.style.height = e.target.scrollHeight + "px";
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Escape") discardEdit();
                                  }}
                                  className="w-full text-[15px] leading-relaxed bg-transparent resize-none overflow-hidden outline-none animate-in fade-in duration-150"
                                  style={{
                                    color: "var(--text-primary)",
                                    border: "1px solid var(--color-brand)",
                                    borderRadius: "6px",
                                    padding: "8px 12px",
                                    marginLeft: "-13px",
                                    marginTop: "-9px",
                                    boxShadow: "0 0 0 2px rgba(43,85,151,0.15)",
                                  }}
                                  autoFocus
                                />
                                <div className="flex gap-2 animate-in fade-in duration-150">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); saveEdit(); }}
                                    className="px-4 h-8 rounded-[6px] text-[13px] font-semibold transition-colors bg-[var(--color-brand)] text-[var(--text-on-primary)]"
                                  >
                                    {t("common.save", "Save")}
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); discardEdit(); }}
                                    className="px-4 h-8 rounded-[6px] text-[13px] font-semibold transition-colors bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                                  >
                                    {t("common.discard", "Discard")}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-2 flex-1 w-full">
                                <span
                                  className="text-[15px] leading-relaxed flex-1 font-medium"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {p.text}
                                </span>

                                {/* Inline Source Chips */}
                                {p.sources && p.sources.length > 0 && (
                                  <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                    {/* AI Confidence Tag */}
                                    <div
                                      className="inline-flex items-center px-2 py-0.5 rounded-[4px] border transition-all cursor-default select-none"
                                      style={{
                                        backgroundColor: p.aiConfidence === 'High' ? "rgba(78, 209, 153, 0.08)" : 
                                                         p.aiConfidence === 'Medium' ? "rgba(255, 218, 138, 0.08)" : 
                                                         "rgba(247, 163, 168, 0.08)",
                                        borderColor: p.aiConfidence === 'High' ? "rgba(78, 209, 153, 0.3)" : 
                                                     p.aiConfidence === 'Medium' ? "rgba(255, 218, 138, 0.3)" : 
                                                     "rgba(247, 163, 168, 0.3)",
                                        fontSize: "11px",
                                        color: p.aiConfidence === 'High' ? "var(--color-positive)" : 
                                               p.aiConfidence === 'Medium' ? "var(--text-warning)" : 
                                               "var(--color-negative)",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {p.aiConfidence} Confidence
                                    </div>

                                    {p.sources.map((src, i) => (
                                      <div 
                                        key={i}
                                        title={`${src.documentName} (${src.origin})`}
                                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] border transition-all animate-in fade-in zoom-in-95 duration-200 cursor-default select-none group/chip"
                                        style={{
                                          backgroundColor: src.origin === 'H&P' ? "rgba(43, 85, 151, 0.04)" : "rgba(111, 143, 217, 0.04)",
                                          borderColor: src.origin === 'H&P' ? "rgba(43, 85, 151, 0.2)" : "rgba(111, 143, 217, 0.2)",
                                          fontSize: "11px",
                                          color: src.origin === 'H&P' ? "var(--color-brand)" : "var(--color-info)",
                                          opacity: isActive ? 1 : 0.75,
                                        }}
                                      >
                                        <span 
                                          className="font-bold text-[8px] uppercase tracking-tighter px-1 rounded-[2px]" 
                                          style={{ 
                                            backgroundColor: src.origin === 'H&P' ? "rgba(43,85,151,0.1)" : "rgba(111,143,217,0.1)",
                                            color: src.origin === 'H&P' ? "var(--color-brand)" : "var(--color-info)",
                                          }}
                                        >
                                          {src.origin}
                                        </span>
                                        <span className="max-w-[220px] truncate font-normal group-hover/chip:underline underline-offset-2 decoration-1">{src.documentName}</span>
                                        <span className="text-[10px] opacity-40 font-bold tabular-nums">· {src.percentage}%</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
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
                            <span className="font-bold">{t("review.rejectionReason", "Rejection Reason")}: </span>
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
            backgroundColor: "var(--bg-card)",
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
                  onRevert={() => handleRevert(selectedParagraph.id)}
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
                  {t("review.selectParagraph")}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      <StickyFooter justify="between">
        <FooterButton
          label={t("common.back")}
          icon={<ArrowLeft className="w-[14px] h-[14px]" />}
          variant="secondary"
          onClick={() => navigate("/scope")}
        />
        <FooterButton
          label="Complete Review"
          icon={<Check className="w-[14px] h-[14px]" />}
          variant="primary"
          disabled={!isAllReviewed}
          onClick={() => navigate("/dashboard")}
        />
      </StickyFooter>
    </div>
  );
}

