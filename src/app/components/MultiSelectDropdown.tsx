import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

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

  const getDisplayText = () => {
    if (values.length === 0) return placeholder;
    if (values.length === 1) {
      const selected = options.find((opt) => opt.value === values[0]);
      return selected?.label || "";
    }
    return `${values.length} selected`;
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
          height: 40,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          padding: "0 12px",
        }}
      >
        <span
          style={{
            flex: 1,
            color: values.length > 0 ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
          }}
        >
          {getDisplayText()}
        </span>

        <ChevronDown
          size={16}
          style={{
            color: "var(--color-text-tertiary)",
            transition: "transform 0.2s",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
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