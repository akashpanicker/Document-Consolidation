import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from "lucide-react";

interface MultiSelectDropdownProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export function MultiSelectDropdown({
  label,
  values,
  onChange,
  options,
  placeholder = "Select options...",
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    if (values.includes(optionValue)) {
      onChange(values.filter((v) => v !== optionValue));
    } else {
      onChange([...values, optionValue]);
    }
  };

  const removeValue = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(values.filter((v) => v !== optionValue));
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {label && (
        <label
          style={{
            color: "var(--color-text-secondary)",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "1px",
            textTransform: "uppercase",
            fontFamily: "Inter, sans-serif",
            display: "block",
            paddingBottom: 6,
          }}
        >
          {label}
        </label>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "relative",
          backgroundColor: "var(--color-surface-2)",
          border: `1px solid ${isOpen ? "var(--color-brand)" : "var(--color-surface-5)"}`,
          borderRadius: 4,
          minHeight: 40,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          padding: values.length > 0 ? "4px 12px 4px 6px" : "0 12px",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        {values.length === 0 ? (
          <span
            style={{
              flex: 1,
              color: "var(--color-text-tertiary)",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {placeholder}
          </span>
        ) : (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, flex: 1 }}>
              {values.map((val) => {
                const opt = options.find((o) => o.value === val);
                return (
                  <span
                    key={val}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      backgroundColor: "rgba(43,85,151,0.12)",
                      color: "var(--color-brand)",
                      fontSize: 12,
                      fontWeight: 600,
                      fontFamily: "Inter, sans-serif",
                      padding: "2px 6px 2px 8px",
                      borderRadius: 4,
                      lineHeight: "20px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {opt?.label || val}
                    <span
                      onClick={(e) => removeValue(val, e)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        borderRadius: 3,
                        width: 16,
                        height: 16,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(43,85,151,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <X size={11} />
                    </span>
                  </span>
                );
              })}
            </div>
          </>
        )}

        <ChevronDown
          size={16}
          style={{
            color: "var(--color-text-tertiary)",
            transition: "transform 0.2s",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        />
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 4,
            backgroundColor: "var(--color-surface-2)",
            border: `1px solid var(--color-surface-5)`,
            borderRadius: 4,
            maxHeight: 240,
            overflowY: "auto",
            zIndex: 1000,
            boxShadow: "var(--shadow-dropdown)",
          }}
        >
          {options.map((option) => {
            const isSelected = values.includes(option.value);
            return (
              <div
                key={option.value}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(option.value);
                }}
                style={{
                  padding: "8px 12px",
                  color: "var(--color-text-primary)",
                  fontSize: 14,
                  fontFamily: "Inter, sans-serif",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-surface-3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 3,
                    border: isSelected ? "none" : `1px solid var(--color-surface-5)`,
                    backgroundColor: isSelected ? "var(--color-brand)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {isSelected && <Check size={12} color="#FFFFFF" />}
                </div>
                <span>{option.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}