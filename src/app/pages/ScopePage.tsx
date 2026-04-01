import { useState, useEffect } from "react";
import { useScopeState } from "../hooks/useScopeState";
import { ScopeLayout1 } from "../layouts/ScopeLayout1";
import { ScopeLayout2 } from "../layouts/ScopeLayout2";

const LAYOUT_STORAGE_KEY = "hp_doc_scope_layout";

export function ScopePage() {
  const scopeState = useScopeState();
  const [activeLayout, setActiveLayout] = useState<1 | 2>(() => {
    const saved = localStorage.getItem(LAYOUT_STORAGE_KEY);
    return saved === "2" ? 2 : 1;
  });

  useEffect(() => {
    localStorage.setItem(LAYOUT_STORAGE_KEY, activeLayout.toString());
  }, [activeLayout]);

  const props = {
    ...scopeState,
    layoutSwitcher: {
      activeLayout,
      onLayoutChange: setActiveLayout
    }
  };

  if (activeLayout === 1) {
    return <ScopeLayout1 {...props} />;
  }

  return <ScopeLayout2 {...props} />;
}
