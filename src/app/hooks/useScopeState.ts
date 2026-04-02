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
const _RIGS = ["land-rig", "offshore-rig", "workover-rig", "drilling-rig", "completion-rig", "coiled-tubing-rig", "snubbing-unit"];
const _ALL_ACTIVITY_IDS = [
  "life-critical","hse-governance","drilling-ops","well-control","pipe-tubular",
  "mud-solids","pressure-drilling-line","rig-move","lifting-hoisting","tools-equipment",
  "maintenance-electrical","non-drilling","emergency-response","environmental-logistics","loto",
];

const _TITLES = [
  "Environmental Management Plan", "Waste Disposal Procedure", "Spill Response Guide",
  "HSE Risk Assessment", "Safety Induction Manual", "Drilling Operations Standard",
  "BOP Maintenance Instruction", "Well Control Handover", "Emergency Muster Procedure",
  "Chemical Handling Standard", "Rig Floor Safety Rules", "Lifting Operations Manual",
  "Permit to Work Standard", "Incident Reporting Procedure", "Asset Integrity Guide",
];
const _KCAD_CODES = ["AZ", "CW", "KS", "AL", "SA", "OM", "CO", "PK", "EU", "AU"];
const _KCAD_REGIONS = [
  { label: "Americas", reg: "united-states", cnt: "us" },
  { label: "Europe", reg: "europe", cnt: "eu" },
  { label: "MENA", reg: "saudi-arabia", cnt: "sa" },
  { label: "Asia Pacific", reg: "pakistan", cnt: "pk" },
  { label: "Canada", reg: "canada", cnt: "ca" },
  { label: "Australia", reg: "australia", cnt: "au" },
  { label: "Oman", reg: "oman", cnt: "om" },
  { label: "Algeria", reg: "algeria", cnt: "dz" },
  { label: "Pakistan", reg: "pakistan", cnt: "pk" },
  { label: "Colombia", reg: "brazil", cnt: "br" }, // using brazil as proxy
  { label: "Kazakhstan", reg: "russia", cnt: "ru" }, // using russia as proxy
  { label: "Corporate", reg: "united-kingdom", cnt: "gb" },
];

function _generateKcadDocs(): SourceDocument[] {
  const real: SourceDocument[] = [
    {
      id: "kc-1", origin: "KCAD",
      name: "K-AZ 012 Environmental Management Work Instruction.pdf",
      code: "K-AZ-012", revision: "Rev. 02", category: "Checklist",
      activities: ["environmental-logistics"], lastUpdated: "27 Jan 2024",
      country: "az", region: "azerbaijan", rig: "land-rig",
      url: "https://example.com/kc-012", hasMsBadge: true,
    },
    {
      id: "kc-2", origin: "KCAD",
      name: "K-CW 100 Environmental Management Guide.pdf",
      code: "K-CW-100", revision: "Rev. 01", category: "Standard",
      activities: ["environmental-logistics"], lastUpdated: "10 Feb 2024",
      country: "dz", region: "algeria", rig: "land-rig",
      url: "https://example.com/kc-100", hasMsBadge: true,
    },
    {
      id: "kc-3", origin: "KCAD",
      name: "K-CW 103 Environmental Management Guide — Corporate.pdf",
      code: "K-CW-103", revision: "Rev. 03", category: "Standard",
      activities: ["environmental-logistics"], lastUpdated: "23 Mar 2024",
      country: "om", region: "oman", rig: "offshore-rig",
      url: "https://example.com/kc-103", hasMsBadge: true,
    },
    {
      id: "kc-4", origin: "KCAD",
      name: "K-CW 023 Environmental Management Procedure.pdf",
      code: "K-CW-023", revision: "Rev. 01", category: "Procedure",
      activities: ["environmental-logistics"], lastUpdated: "06 Apr 2023",
      country: "kw", region: "kuwait", rig: "land-rig",
      url: "https://example.com/kc-023", hasMsBadge: true,
    },
    {
      id: "kc-5", origin: "KCAD",
      name: "K-CW 002 Health and Safety Procedure.pdf",
      code: "K-CW-002", revision: "Rev. 02", category: "Procedure",
      activities: ["hse-governance"], lastUpdated: "17 May 2023",
      country: "iq", region: "iraq", rig: "land-rig",
      url: "https://example.com/kc-002", hasMsBadge: true,
    },
    {
      id: "kc-6", origin: "KCAD",
      name: "K-KS 027 Health and Safety Procedure — Kazakhstan.pdf",
      code: "K-KS-027", revision: "Rev. 01", category: "Procedure",
      activities: ["hse-governance"], lastUpdated: "29 Jun 2023",
      country: "ru", region: "russia", rig: "land-rig",
      url: "https://example.com/kc-027", hasMsBadge: true,
    },
    {
      id: "kc-7", origin: "KCAD",
      name: "K-AL 056 Operations Work Instruction — Algeria.pdf",
      code: "K-AL-056", revision: "Rev. 04", category: "Checklist",
      activities: ["non-drilling"], lastUpdated: "11 Jul 2023",
      country: "dz", region: "algeria", rig: "land-rig",
      url: "https://example.com/kc-056", hasMsBadge: true,
    },
  ];

  const generated: SourceDocument[] = [];
  for (let i = 8; i <= 1000; i++) {
    const codeExt = _KCAD_CODES[i % _KCAD_CODES.length];
    const num = String(i).padStart(3, "0");
    const title = _TITLES[i % _TITLES.length];
    const regObj = _KCAD_REGIONS[i % _KCAD_REGIONS.length];
    
    let cat = "Standard";
    if (title.includes("Procedure")) cat = "Procedure";
    else if (title.includes("Instruction") || title.includes("Checklist")) cat = "Checklist";

    generated.push({
      id: `kc-${i}`,
      origin: "KCAD",
      name: `K-${codeExt} ${num} ${title} — ${regObj.label}.pdf`,
      code: `K-${codeExt}-${num}`,
      revision: _REVISIONS[i % _REVISIONS.length],
      category: cat,
      activities: [_ALL_ACTIVITY_IDS[i % _ALL_ACTIVITY_IDS.length]],
      lastUpdated: _DATES[i % _DATES.length],
      country: regObj.cnt,
      region: regObj.reg,
      rig: _RIGS[i % _RIGS.length],
      url: `https://example.com/kc-${i}`,
    });
  }
  return [...real, ...generated];
}

function _generateHpDocs(): SourceDocument[] {
  const real: SourceDocument[] = [
    {
      id: "hp-1", origin: "H&P",
      name: "EM01 Scope of Environmental Management System.pdf",
      code: "EM01", revision: "Rev. 04", category: "Standard",
      activities: ["environmental-logistics"], lastUpdated: "12 Dec 2024",
      country: "us", region: "united-states", rig: "land-rig",
      url: "https://example.com/hp-em01", hasMsBadge: true,
    },
    {
      id: "hp-2", origin: "H&P",
      name: "EM11 Calibration.pdf",
      code: "EM11", revision: "Rev. 02", category: "Checklist",
      activities: ["environmental-logistics"], lastUpdated: "15 Jan 2025",
      country: "us", region: "united-states", rig: "land-rig",
      url: "https://example.com/hp-em11",
    },
    {
      id: "hp-3", origin: "H&P",
      name: "EM13 Internal EMS Audit.pdf",
      code: "EM13", revision: "Rev. 03", category: "Checklist",
      activities: ["environmental-logistics", "hse-governance"], lastUpdated: "22 Mar 2025",
      country: "ca", region: "canada", rig: "offshore-rig",
      url: "https://example.com/hp-em13",
    },
    {
      id: "hp-4", origin: "H&P",
      name: "HSE 003.pdf",
      code: "HSE-003", revision: "Rev. 01", category: "Standard",
      activities: ["hse-governance"], lastUpdated: "05 Apr 2025",
      country: "us", region: "united-states", rig: "land-rig",
      url: "https://example.com/hp-hse003",
    },
    {
      id: "hp-5", origin: "H&P",
      name: "HSE 004 Confined Space Entry Procedure.pdf",
      code: "HSE-004", revision: "Rev. 06", category: "Procedure",
      activities: ["life-critical"], lastUpdated: "30 Jun 2024",
      country: "gb", region: "united-kingdom", rig: "offshore-rig",
      url: "https://example.com/hp-hse004",
    },
    {
      id: "hp-6", origin: "H&P",
      name: "HSE 005 Hot Work Procedure.pdf",
      code: "HSE-005", revision: "Rev. 05", category: "Procedure",
      activities: ["life-critical"], lastUpdated: "12 Jul 2024",
      country: "gb", region: "united-kingdom", rig: "offshore-rig",
      url: "https://example.com/hp-hse005",
    },
    {
      id: "hp-7", origin: "H&P",
      name: "HSE 008 Lock-out Tag-out Try-out Procedure.pdf",
      code: "HSE-008", revision: "Rev. 04", category: "Procedure",
      activities: ["loto"], lastUpdated: "25 Aug 2024",
      country: "ca", region: "canada", rig: "land-rig",
      url: "https://example.com/hp-hse008",
    },
    {
      id: "hp-8", origin: "H&P",
      name: "HSE 016 DROPS Manual.pdf",
      code: "HSE-016", revision: "Rev. 08", category: "Standard",
      activities: ["rig-move", "lifting-hoisting"], lastUpdated: "08 Sep 2024",
      country: "us", region: "united-states", rig: "land-rig",
      url: "https://example.com/hp-hse016", hasMsBadge: true,
    },
    {
      id: "hp-9", origin: "H&P",
      name: "HSE 019 Hydrogen Sulfide H2S Policy.pdf",
      code: "HSE-019", revision: "Rev. 03", category: "Policy",
      activities: ["emergency-response"], lastUpdated: "19 Oct 2024",
      country: "sa", region: "saudi-arabia", rig: "land-rig",
      url: "https://example.com/hp-hse019",
    },
    {
      id: "hp-10", origin: "H&P",
      name: "HSE 025 Buffer Zones and Barricades Procedure.pdf",
      code: "HSE-025", revision: "Rev. 02", category: "Procedure",
      activities: ["rig-move"], lastUpdated: "01 Nov 2024",
      country: "us", region: "united-states", rig: "land-rig",
      url: "https://example.com/hp-hse025",
    },
    {
      id: "hp-11", origin: "H&P",
      name: "GDE-PPHG-0001.pdf",
      code: "GDE-PPHG-0001", revision: "Rev. 01", category: "Standard",
      activities: ["drilling-ops"], lastUpdated: "15 Dec 2024",
      country: "us", region: "united-states", rig: "land-rig",
      url: "https://example.com/hp-gde0001", hasMsBadge: true,
    },
  ];

  const generated: SourceDocument[] = [];
  const prefixes = ["HSE", "EM", "GDE", "PPHG"];
  for (let i = 12; i <= 1000; i++) {
    const prefix = prefixes[i % prefixes.length];
    const num = String(i).padStart(3, "0");
    const title = _TITLES[i % _TITLES.length];
    const rc = _REGIONS[i % _REGIONS.length];
    
    let cat = "Standard";
    if (title.includes("Procedure")) cat = "Procedure";
    else if (title.includes("Instruction") || title.includes("Checklist")) cat = "Checklist";

    generated.push({
      id: `hp-${i}`,
      origin: "H&P",
      name: `${prefix} ${num} ${title} — ${rc.region.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ")}.pdf`,
      code: `${prefix}-${num}`,
      revision: _REVISIONS[i % _REVISIONS.length],
      category: cat,
      activities: [_ALL_ACTIVITY_IDS[i % _ALL_ACTIVITY_IDS.length]],
      lastUpdated: _DATES[i % _DATES.length],
      country: rc.country,
      region: rc.region,
      rig: _RIGS[i % _RIGS.length],
      url: `https://example.com/hp-${i}`,
    });
  }
  return [...real, ...generated];
}

export const SOURCE_DOCUMENTS: SourceDocument[] = [
  ..._generateHpDocs(),
  ..._generateKcadDocs(),
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
    let rawFiltered = SOURCE_DOCUMENTS.filter((doc) => {
      if (regions.length > 0 && !regions.includes(doc.region)) return false;
      if (rigTypes.length > 0 && !rigTypes.includes(doc.rig)) return false;
      if (selectedActivities.length > 0 && !doc.activities.some((a) => selectedActivities.includes(a))) return false;
      return true;
    });

    // Fallback: If no results, show some "Suggested" documents instead of an empty screen
    if (rawFiltered.length === 0) {
      // Pick some documents that match at least ONE of the filters if possible
      rawFiltered = SOURCE_DOCUMENTS.filter((doc) => {
        if (regions.length > 0 && regions.includes(doc.region)) return true;
        if (selectedActivities.length > 0 && doc.activities.some((a) => selectedActivities.includes(a))) return true;
        return false;
      });
      
      // If still empty (e.g. no regions/activities selected OR all mismatch), show a random selection
      if (rawFiltered.length === 0) {
        rawFiltered = SOURCE_DOCUMENTS.slice(0, 10);
      } else {
        rawFiltered = rawFiltered.slice(0, 15); // Limit fallback to 15 suggested items
      }
    }

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
