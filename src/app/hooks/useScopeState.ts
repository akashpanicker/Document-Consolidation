import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { SourceDocument, Activity } from "../types/ScopeLayoutProps";

export const ACTIVITIES: Activity[] = [
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

const _REGIONS: Array<{ region: string; country: string }> = [
  { region: "united-states",   country: "us" },
  { region: "canada",          country: "ca" },
  { region: "united-kingdom",  country: "gb" },
  { region: "saudi-arabia",    country: "sa" },
  { region: "oman",            country: "om" },
  { region: "kuwait",          country: "kw" },
  { region: "iraq",            country: "iq" },
  { region: "australia",       country: "au" },
  { region: "azerbaijan",      country: "az" },
  { region: "netherlands",     country: "nl" },
  { region: "pakistan",        country: "pk" },
  { region: "russia",          country: "ru" },
  { region: "algeria",         country: "dz" },
  { region: "germany",         country: "de" },
  { region: "europe",          country: "eu" },
];
const _REVISIONS = ["Rev. 01","Rev. 02","Rev. 03","Rev. 04","Rev. 05","Rev. 06","Rev. 07","Rev. 08"];
const _DATES = [
  "03 Jan 2025","14 Feb 2025","22 Mar 2025","05 Apr 2025",
  "18 May 2024","30 Jun 2024","12 Jul 2024","25 Aug 2024",
  "08 Sep 2024","19 Oct 2024","01 Nov 2024","15 Dec 2024",
  "27 Jan 2024","10 Feb 2024","23 Mar 2024","06 Apr 2023",
  "17 May 2023","29 Jun 2023","11 Jul 2023","24 Aug 2023",
];
const _RIGS = ["rig-1","rig-2","rig-3","rig-4","rig-5"];
const _ALL_ACTIVITY_IDS = [
  "life-critical","hse-governance","drilling-ops","well-control","pipe-tubular",
  "mud-solids","pressure-drilling-line","rig-move","lifting-hoisting","tools-equipment",
  "maintenance-electrical","non-drilling","emergency-response","environmental-logistics","loto",
];

const _HP_TEMPLATES: Array<{ prefix: string; category: string; names: string[] }> = [
  { prefix: "HSE", category: "HSE", names: [
    "Hot Work Procedure","H₂S Monitoring and Response","Confined Space Entry",
    "Permit to Work System","Job Safety Analysis","Chemical Handling Protocol",
    "PPE Requirements Standard","Noise Exposure Control","Ergonomics Standard",
    "Radiation Safety Procedure","Biological Hazard Control","Fatigue Risk Management",
    "Alcohol and Drug Policy","Heat Stress Management","Cold Weather Operations",
    "Dropped Objects Prevention","Hand Injury Prevention","Slip Trip and Fall Prevention",
    "Eye and Face Protection","Respiratory Protection Program",
  ]},
  { prefix: "WC", category: "Well Control", names: [
    "Well Control Manual","BOP Testing and Maintenance","Kick Detection Procedure",
    "Blowout Prevention Plan","Pressure Control Operations","Diverter System Operations",
    "Casing Design Standard","Cementing Procedure","Pore Pressure Prediction",
    "Kill Sheet Preparation","Mud Weight Program","Annular Pressure Management",
    "Choke Manifold Operations","Well Barrier Policy","Stripping Operations",
    "Volumetric Well Control","Lubricate and Bleed Procedure","Gas Migration Monitoring",
    "Underground Blowout Response","Well Control Drills and Exercises",
  ]},
  { prefix: "RM", category: "Rig Management", names: [
    "Rig Floor Safety Procedures","Crane Operations Manual","Rig Move Procedure",
    "Equipment Inspection Standard","Preventive Maintenance Schedule","Rig Commissioning Plan",
    "Hoisting Operations Guide","Tubular Handling Procedure","Iron Roughneck Operations",
    "Top Drive Maintenance","Drawworks Inspection","Crown Block Safety",
    "Traveling Block Maintenance","Weight Indicator Calibration","Rotary Table Operations",
    "Kelly Drive Maintenance","Mast and Substructure Inspection","Rig Floor Layout Standard",
    "Mousehole and Rathole Procedures","Rig Down and Move Checklist",
  ]},
  { prefix: "DR", category: "Drilling", names: [
    "Drilling Program Template","Directional Drilling Guide","Mud Program Design",
    "Bit Selection Criteria","Drilling Hazards Manual","Lost Circulation Procedure",
    "Stuck Pipe Prevention Guide","Wellbore Stability Analysis","Coring Operations",
    "Logging Operations Manual","Underbalanced Drilling Procedure","Managed Pressure Drilling",
    "Horizontal Drilling Guide","Extended Reach Drilling","Deepwater Drilling Standard",
    "HPHT Drilling Procedure","Geothermal Drilling Standard","Coal Bed Methane Drilling",
    "Air Drilling Operations","Foam Drilling Procedure",
  ]},
  { prefix: "ME", category: "Maintenance & Electrical", names: [
    "Electrical Safety Standard","LOTO Procedure","Motor Control Center Maintenance",
    "Generator Maintenance Guide","Instrumentation Calibration","Control System Procedure",
    "Pressure Vessel Inspection","Pump Maintenance Schedule","Valve Testing Procedure",
    "Cooling System Maintenance","Hydraulic System Maintenance","Pneumatic System Guide",
    "Cathodic Protection Standard","Transformer Maintenance","UPS System Maintenance",
    "Variable Frequency Drive Maintenance","PLC Programming Standard","SCADA System Procedure",
    "Vibration Monitoring Program","Thermographic Inspection",
  ]},
  { prefix: "ENV", category: "Environmental", names: [
    "Waste Management Plan","Spill Response Procedure","Environmental Monitoring Program",
    "Water Discharge Standard","Air Emissions Control","Soil Contamination Response",
    "Wildlife Protection Protocol","Carbon Emissions Reporting","Chemical Inventory Management",
    "Environmental Audit Procedure","Noise Pollution Control","Light Pollution Standard",
    "Biodiversity Assessment","Stormwater Management","Groundwater Monitoring",
    "Oilfield Waste Disposal","Drilling Fluid Management","Reserve Pit Closure",
    "Produced Water Management","Environmental Impact Reporting",
  ]},
  { prefix: "OPS", category: "Operations", names: [
    "Operations Management Manual","Shift Handover Procedure","Daily Reporting Standard",
    "Contractor Management Plan","Management of Change","Lessons Learned Process",
    "KPI Monitoring Procedure","Operational Risk Assessment","Work Permit System",
    "Critical Task Analysis","Simultaneous Operations Plan","Non-Routine Operations",
    "Third Party Operations Guide","Remote Operations Procedure","Offshore Operations Manual",
    "Night Operations Standard","Emergency Shutdown Procedure","Process Isolation",
    "Line Breaking Procedure","Excavation and Ground Disturbance",
  ]},
  { prefix: "SF", category: "Safety", names: [
    "Safety Management System","Incident Investigation Procedure","Emergency Drill Schedule",
    "Safety Observation Program","Behavior Based Safety","Stop Work Authority Policy",
    "Safety Leadership Framework","Near Miss Reporting","Safety Metrics Dashboard",
    "Risk Register Management","Bowtie Analysis Guide","Safety Critical Roles",
    "Safety Alert Distribution","Lessons Learned Integration","Process Hazard Analysis",
    "Layer of Protection Analysis","Safety Integrity Level Assessment","Pre-Startup Safety Review",
    "Management of Change Safety Review","Safety Case Development",
  ]},
  { prefix: "TR", category: "Training", names: [
    "New Employee Orientation","Competency Assessment Framework","Skills Training Matrix",
    "Refresher Training Schedule","On-the-Job Training Guide","Simulator Training Procedure",
    "Certification Requirements","Training Record Management","Technical Training Standard",
    "Leadership Development Program","Cross-Training Initiative","E-Learning Platform Guide",
    "Safety Training Passport","Annual Training Plan","Onboarding Checklist",
    "Toolbox Talk Program","Pre-Job Safety Meeting","Competency Verification",
    "Mentoring Program","Knowledge Transfer Procedure",
  ]},
  { prefix: "EM", category: "Emergency Response", names: [
    "Emergency Response Plan","Muster Station Procedure","Evacuation Drill Guide",
    "Medical Emergency Response","Fire Fighting Procedure","Rescue Operations Manual",
    "Crisis Communication Plan","Business Continuity Plan","Pandemic Response",
    "Natural Disaster Response","Security Incident Response","Toxic Release Response",
    "Mass Casualty Plan","Search and Rescue Procedure","Man Overboard Response",
    "Helicopter Emergency Procedure","Structural Collapse Response","Explosion Response",
    "Well Blowout Emergency Response","Spill Emergency Response",
  ]},
];

const _KCAD_TEMPLATES: Array<{ prefix: string; category: string; names: string[] }> = [
  { prefix: "KCAD-HSE", category: "HSE", names: [
    "Global HSE Standard","HSE Management System","Risk Management Framework",
    "Hazard Identification Process","Corporate Safety Rules","Life Saving Rules",
    "HSE Performance Standard","Contractor HSE Requirements","Process Safety Management",
    "Asset Integrity Standard","Safety Case Requirement","HSE Legal Register",
    "Safety Critical Equipment","HSE Culture Assessment","Personal Safety Plan",
    "Major Accident Hazard Register","Safety Critical Maintenance","HSE Audit Protocol",
    "HSE Reporting Standard","Health Risk Assessment",
  ]},
  { prefix: "KCAD-WI", category: "Well Control", names: [
    "Well Integrity Management System","Well Lifecycle Standard","Pressure Testing Protocol",
    "Well Barrier Elements","Annulus Pressure Management","Tubing Integrity Monitoring",
    "Christmas Tree Maintenance","Wellhead Inspection Standard","Downhole Safety Valve",
    "Corrosion Management","Scale Management","Hydrate Prevention",
    "Flow Assurance Standard","Production Optimization","Artificial Lift Standard",
    "Well Abandonment Procedure","Plug and Abandonment Standard","Zonal Isolation Verification",
    "Well Integrity Risk Assessment","Long-Term Well Monitoring",
  ]},
  { prefix: "KCAD-ENV", category: "Environmental", names: [
    "Environmental Compliance Guide","ISO 14001 Implementation","Environmental Impact Assessment",
    "Carbon Neutrality Roadmap","Scope 3 Emissions Reporting","Biodiversity Net Gain",
    "Water Stewardship Standard","Circular Economy Standard","Plastic Reduction Policy",
    "Deforestation-Free Standard","Methane Reduction Program","Flaring Reduction Policy",
    "Environmental Liability Management","Remediation Standard","Site Decommissioning",
    "ESIA Methodology","Environmental Permit Management","Air Quality Monitoring",
    "Ecological Survey Standard","Cumulative Impact Assessment",
  ]},
  { prefix: "KCAD-RM", category: "Rig Management", names: [
    "Rotating Equipment Safeguards","Mechanical Integrity Program","Equipment Reliability",
    "Maintenance Management System","Spare Parts Management","Vendor Management",
    "Equipment Life Extension","Fitness for Service Assessment","Inspection Frequency Matrix",
    "Corrosion Under Insulation","Pressure Relief System","Safety Instrumented System",
    "Alarm Management Standard","Control Valve Maintenance","Heat Exchanger Cleaning",
    "Static Equipment Inspection","Dynamic Equipment Standard","Piping Integrity Management",
    "Tank Inspection Standard","Subsea Equipment Maintenance",
  ]},
  { prefix: "KCAD-EM", category: "Emergency Response", names: [
    "Emergency Equipment Requirements","Emergency Response Organization","Crisis Management",
    "Business Resilience Standard","Incident Command System","Emergency Contact Directory",
    "Mutual Aid Agreement","Emergency Communication Plan","Evacuation Route Planning",
    "Emergency Resource Inventory","Post-Incident Review","Emergency Budget Planning",
    "Tabletop Exercise Guide","Full-Scale Exercise Standard","Recovery Operations",
    "Emergency Notification System","External Agency Coordination","Media Management",
    "Emergency Command Center","Emergency Logistics Standard",
  ]},
  { prefix: "KCAD-DR", category: "Drilling", names: [
    "Drilling Engineering Standard","Well Design Philosophy","Casing Program Design",
    "Completion Design Standard","Drilling Contractor Selection","Well Cost Estimation",
    "Drilling Performance Metrics","NPT Reduction Program","Technology Qualification",
    "Digital Drilling Standard","Automated Drilling Guide","Drilling Data Management",
    "Well Prognosis Template","Post-Well Review","Lessons Learned Integration",
    "Drilling Risk Assessment","Technical Limit Drilling","Benchmarking Standard",
    "Rig Selection Criteria","Drilling Tender Management",
  ]},
  { prefix: "KCAD-OPS", category: "Operations", names: [
    "Operations Excellence Framework","Asset Management Standard","Operations Readiness",
    "Startup and Shutdown Procedure","Abnormal Situation Management","Process Optimization",
    "Operational Discipline","Field Operations Manual","Production Reporting",
    "Energy Management System","Utility Optimization","Reliability-Centered Maintenance",
    "Total Productive Maintenance","5S Workplace Standard","Visual Management",
    "Operational Risk Control","Production Loss Management","Permit to Work Governance",
    "Key Performance Indicator Framework","Operational Learning Standard",
  ]},
  { prefix: "KCAD-SF", category: "Safety", names: [
    "Personnel Safety Handbook","Golden Rules of Safety","Critical Control Management",
    "Safety Culture Maturity Model","Psychological Safety Framework","Human Factors Standard",
    "Error Prevention Tools","Crew Resource Management","Safety Perception Survey",
    "Leading Indicators Guide","Safety Recognition Program","Community Safety Standard",
    "Road Safety Policy","Lone Worker Safety","Contractor Safety Management",
    "Occupational Health Standard","Ergonomic Assessment","Manual Handling",
    "Driver Safety Standard","Marine Safety Standard",
  ]},
  { prefix: "KCAD-ME", category: "Maintenance & Electrical", names: [
    "Electrical Area Classification","Hazardous Area Equipment Standard","Intrinsic Safety Standard",
    "High Voltage Operations","Lightning Protection","Grounding and Bonding",
    "Power System Reliability","Electrical Isolation Standard","Arc Flash Protection",
    "Thermal Imaging Program","Motor Management System","Variable Speed Drive",
    "Battery System Maintenance","Solar Power Integration","Smart Grid Standard",
    "Electrical Equipment Inspection","Switchgear Maintenance","Cable Management",
    "Earthing and Bonding Verification","Electrical Safety Management",
  ]},
  { prefix: "KCAD-TR", category: "Training", names: [
    "Global Training Standard","Learning Management System","Digital Learning Content",
    "Competency Framework","Succession Planning","Knowledge Management",
    "Expert Network Program","Mentoring Standard","Coaching Program",
    "Cross-Functional Training","Leadership Training Program","Technical Excellence Program",
    "Graduate Development Standard","Apprenticeship Standard","Continuous Learning Culture",
    "Training Needs Analysis","Competency Assurance","Workforce Development Plan",
    "Job Task Analysis","Performance Support Standard",
  ]},
];

function _generateDocs(
  origin: "H&P" | "KCAD",
  templates: typeof _HP_TEMPLATES,
  idPrefix: string,
): SourceDocument[] {
  const docs: SourceDocument[] = [];
  let seq = 1;

  for (const tpl of templates) {
    for (let ni = 0; ni < tpl.names.length; ni++) {
      // 5 region/rig variants per name → 10 templates × 20 names × 5 = 1000 per origin
      for (let v = 0; v < 5; v++) {
        const i = seq++;
        const rc = _REGIONS[(i * 7 + v * 3) % _REGIONS.length];
        const actCount = 1 + (i % 3);
        const actStart = (i * 4 + v) % _ALL_ACTIVITY_IDS.length;
        const activities = Array.from({ length: actCount }, (_, a) =>
          _ALL_ACTIVITY_IDS[(actStart + a) % _ALL_ACTIVITY_IDS.length]
        );
        const codeNum = String(i).padStart(3, "0");
        const name = v === 0 ? tpl.names[ni] : `${tpl.names[ni]} — ${rc.region.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")}`;
        docs.push({
          id: `${idPrefix}-${i}`,
          origin,
          name,
          code: `${tpl.prefix}-${codeNum}`,
          revision: _REVISIONS[(i * 3) % _REVISIONS.length],
          category: tpl.category,
          activities,
          lastUpdated: _DATES[(i * 11) % _DATES.length],
          country: rc.country,
          region: rc.region,
          rig: _RIGS[(i * 2 + v) % _RIGS.length],
          url: `https://example.com/${idPrefix}-${codeNum}`,
        });
      }
    }
  }
  return docs;
}

export const SOURCE_DOCUMENTS: SourceDocument[] = [
  ..._generateDocs("H&P",  _HP_TEMPLATES,   "hp"),
  ..._generateDocs("KCAD", _KCAD_TEMPLATES, "kc"),
];

export const STATUS_MESSAGES_COUNT = 7;

export function useScopeState() {
  const navigate = useNavigate();

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
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const { hpDocs, kcadDocs } = useMemo(() => {
    const rawFiltered = SOURCE_DOCUMENTS.filter((doc) => {
      if (regions.length > 0 && !regions.includes(doc.region)) return false;
      if (rigTypes.length > 0 && !rigTypes.includes(doc.rig)) return false;
      if (selectedActivities.length > 0 && !doc.activities.some((a) => selectedActivities.includes(a))) return false;
      return true;
    });

    const hp = rawFiltered.filter((d) => d.origin === "H&P");
    const kc = rawFiltered.filter((d) => d.origin === "KCAD");

    return { hpDocs: hp, kcadDocs: kc };
  }, [regions, rigTypes, selectedActivities]);

  const toggleDoc = (id: string) => {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const toggleAll = (origin: "H&P" | "KCAD", docs: SourceDocument[]) => {
    const allIds = docs.map((d) => d.id);
    const allSelected = allIds.every((id) => selectedDocs.includes(id));
    if (allSelected) {
      setSelectedDocs((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedDocs((prev) => Array.from(new Set([...prev, ...allIds])));
    }
  };

  const handleClearSelection = () => {
    setSelectedDocs([]);
  };

  const handleProceed = () => {
    setIsGenerating(true);
    setProgress(0);
    setStatusIndex(0);
    setIsSuccess(false);
  };

  const handleBack = () => {
    navigate("/");
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
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES_COUNT);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
      if (successTimeout) clearTimeout(successTimeout);
    };
  }, [isGenerating, navigate]);

  // Extract separated selectedDocs
  const selectedDocuments = {
    hp: selectedDocs.filter(id => hpDocs.some(d => d.id === id)),
    kcad: selectedDocs.filter(id => kcadDocs.some(d => d.id === id)),
  };

  return {
    selectedRegions: regions,
    selectedRigTypes: rigTypes,
    selectedActivities,
    selectedDocuments,
    documents: { hp: hpDocs, kcad: kcadDocs },
    activities: ACTIVITIES,

    onRegionChange: setRegions,
    onRigTypeChange: setRigTypes,
    onActivityChange: toggleActivity,
    onActivitiesChange: setSelectedActivities,
    onDocumentSelect: toggleDoc,
    onToggleAllDocuments: toggleAll,
    onClearSelection: handleClearSelection,

    onProceed: handleProceed,
    onBack: handleBack,

    isGenerating,
    progress,
    statusIndex,
    isSuccess
  };
}
