export interface SourceDocument {
  id: string;
  origin: "H&P" | "KCAD";
  name: string;
  code: string;
  revision: string;
  category: string;
  activities: string[];
  lastUpdated: string;
  country: string;
  region: string;
  rig: string;
  url: string;
  hasMsBadge?: boolean;
}

export interface Activity {
  id: string;
  name: string;
  image: string;
}

export interface ScopeLayoutProps {
  selectedRegions: string[];
  selectedRigTypes: string[];
  selectedActivities: string[];
  selectedDocuments: { hp: string[]; kcad: string[] };
  documents: { hp: SourceDocument[]; kcad: SourceDocument[] };
  activities: Activity[];
  
  onRegionChange: (regions: string[]) => void;
  onRigTypeChange: (rigTypes: string[]) => void;
  onActivityChange: (activityId: string) => void;
  onActivitiesChange: (activities: string[]) => void;
  onDocumentSelect: (id: string) => void;
  onToggleAllDocuments: (origin: "H&P" | "KCAD", docs: SourceDocument[]) => void;
  onClearSelection: () => void;
  
  onProceed: () => void;
  onBack: () => void;

  // AI Modal States
  isGenerating: boolean;
  progress: number;
  statusIndex: number;
  isSuccess: boolean;

  layoutSwitcher: {
    activeLayout: 1 | 2;
    onLayoutChange: (layout: 1 | 2) => void;
  };
}
