import { useState, useEffect } from "react";
import { useNewConsolidationState } from "./hooks/useNewConsolidationState";
import { NewConsolidationLayout1 } from "./layouts/NewConsolidationLayout1";
import { NewConsolidationLayout2 } from "./layouts/NewConsolidationLayout2";

const LAYOUT_STORAGE_KEY = "hp_doc_new_consolidation_layout";

export function NewConsolidationPage() {
  const newConsolidationState = useNewConsolidationState();
  const [activeLayout, setActiveLayout] = useState<1 | 2>(() => {
    const saved = localStorage.getItem(LAYOUT_STORAGE_KEY);
    return saved === "2" ? 2 : 1;
  });

  useEffect(() => {
    localStorage.setItem(LAYOUT_STORAGE_KEY, activeLayout.toString());
  }, [activeLayout]);

  const props = {
    ...newConsolidationState,
    layoutSwitcher: {
      activeLayout,
      onLayoutChange: setActiveLayout
    }
  };

  if (activeLayout === 1) {
    return <NewConsolidationLayout1 {...props} />;
  }

  return <NewConsolidationLayout2 {...props} />;
}
