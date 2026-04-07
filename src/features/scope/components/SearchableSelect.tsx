import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface SearchableSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export function SearchableSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option...",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.label : "";

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
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
        {isOpen ? (
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search..."
            style={{
              flex: 1,
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              color: "var(--color-text-primary)",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            style={{
              flex: 1,
              color: displayValue ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
            }}
          >
            {displayValue || placeholder}
          </span>
        )}

        {value && !isOpen && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              backgroundColor: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              marginRight: 4,
            }}
          >
            <X size={14} color="var(--color-text-tertiary)" />
          </button>
        )}

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
          {filteredOptions.length === 0 ? (
            <div
              style={{
                padding: "12px 16px",
                color: "var(--color-text-tertiary)",
                fontSize: 14,
                fontFamily: "Inter, sans-serif",
              }}
            >
              No results found
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                style={{
                  padding: "8px 12px",
                  color: "var(--color-text-primary)",
                  fontSize: 14,
                  fontFamily: "Inter, sans-serif",
                  cursor: "pointer",
                  backgroundColor: value === option.value ? "var(--color-surface-2)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.backgroundColor = "var(--color-surface-3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== option.value) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}