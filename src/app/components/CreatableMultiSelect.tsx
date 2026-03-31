import { useState, useRef, useEffect } from "react";
import { X, Check, Plus, Search, ChevronDown } from "lucide-react";

interface CreatableMultiSelectProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  predefinedOptions: Array<{ value: string; label: string }>;
  placeholder?: string;
  showToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
}

export function CreatableMultiSelect({
  label,
  values,
  onChange,
  predefinedOptions,
  placeholder = "Select or type...",
  showToggle = false,
  toggleValue = false,
  onToggleChange,
}: CreatableMultiSelectProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);

  const getDisplayLabel = (value: string) => {
    const option = predefinedOptions.find(
      (opt) => opt.value === value,
    );
    return option ? option.label : value;
  };

  const handleRemoveValue = (valueToRemove: string) => {
    onChange(values.filter((v) => v !== valueToRemove));
  };

  const handleSelectOption = (optionValue: string) => {
    if (!values.includes(optionValue)) {
      onChange([...values, optionValue]);
      setInputValue("");
    }
  };

  const handleCreateCustom = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = inputValue.trim();
      // Check for exact predefined match first
      const exactMatch = predefinedOptions.find(
        (opt) =>
          opt.label.toLowerCase() === trimmed.toLowerCase(),
      );
      if (exactMatch && !values.includes(exactMatch.value)) {
        handleSelectOption(exactMatch.value);
      } else if (trimmed && !values.includes(trimmed)) {
        handleCreateCustom();
      }
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      values.length > 0
    ) {
      onChange(values.slice(0, -1));
    }
  };

  // Filter predefined options based on input text
  const filteredOptions = inputValue.trim()
    ? predefinedOptions.filter((opt) =>
        opt.label
          .toLowerCase()
          .includes(inputValue.toLowerCase()),
      )
    : predefinedOptions;

  // Show + button when typed value doesn't match any predefined option
  const hasMatchingPredefined = inputValue.trim()
    ? predefinedOptions.some((opt) =>
        opt.label
          .toLowerCase()
          .includes(inputValue.trim().toLowerCase()),
      )
    : false;

  const showAddButton =
    inputValue.trim() !== "" &&
    !hasMatchingPredefined &&
    !values.includes(inputValue.trim());

  // Show dropdown only when focused (all options when no input, filtered when typing)
  const showDropdown =
    isFocused && filteredOptions.length > 0 && !showAddButton;

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const index = text
      .toLowerCase()
      .indexOf(query.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.substring(0, index)}
        <span style={{ fontWeight: 700, color: "var(--color-text-primary)" }}>
          {text.substring(index, index + query.length)}
        </span>
        {text.substring(index + query.length)}
      </>
    );
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      {(label || (showToggle && onToggleChange)) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          {label && (
            <label
              style={{
                color: "var(--color-text-secondary)",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {label}
            </label>
          )}

          {/* Toggle switch */}
          {showToggle && onToggleChange && (
            <button
              type="button"
              onClick={() => onToggleChange(!toggleValue)}
              style={{
                width: 40,
                height: 20,
                backgroundColor: toggleValue
                  ? "var(--color-brand)"
                  : "var(--color-surface-5)",
                borderRadius: 10,
                border: "none",
                padding: 2,
                cursor: "pointer",
                position: "relative",
                transition: "background-color 0.2s",
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: "var(--color-toggle-thumb)",
                  borderRadius: "50%",
                  transform: toggleValue ? "translateX(20px)" : "translateX(0)",
                  transition: "transform 0.2s",
                }}
              />
            </button>
          )}
        </div>
      )}

      {/* Single input container - only show if toggle is on or no toggle exists */}
      {(!showToggle || toggleValue) && (
        <>
          <div
            onClick={() => inputRef.current?.focus()}
            style={{
              backgroundColor: "var(--color-surface-2)",
              border: `1px solid ${isFocused ? "var(--color-brand)" : "var(--color-surface-5)"}`,
              borderRadius: 6,
              minHeight: 40,
              padding: "6px 12px",
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              alignItems: "center",
              cursor: "text",
              boxShadow: isFocused
                ? "0 0 0 2px rgba(43,85,151,0.2)"
                : "none",
            }}
          >
            <Search size={18} style={{ color: "var(--color-text-tertiary)", marginRight: 2 }} />
            {/* Selected chips */}
            {values.map((value) => (
              <div
                key={value}
                style={{
                  backgroundColor: "var(--color-surface-5)",
                  border: `1px solid var(--color-brand)`,
                  borderRadius: 4,
                  padding: "2px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{
                    color: "var(--color-text-primary)",
                    fontSize: 12,
                    fontWeight: 400,
                    fontFamily: "Inter, sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  {getDisplayLabel(value)}
                </span>
                <X
                  size={12}
                  style={{
                    color: "var(--color-text-tertiary)",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveValue(value);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-error)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--color-text-tertiary)";
                  }}
                />
              </div>
            ))}

            {/* Inline text input */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              placeholder={
                values.length === 0 &&
                (!showToggle || toggleValue)
                  ? placeholder
                  : ""
              }
              style={{
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                color: "var(--color-text-primary)",
                fontSize: 14,
                fontWeight: 400,
                fontFamily: "Inter, sans-serif",
                minWidth: 140,
                flex: 1,
              }}
              className="placeholder:text-[var(--color-text-muted)]"
            />

            {/* + button inside container when no predefined match */}
            {showAddButton && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateCustom();
                }}
                style={{
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "var(--color-surface-4)",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  flexShrink: 0,
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-surface-5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--color-surface-4)";
                }}
              >
                <Plus size={16} style={{ color: "var(--color-success)" }} />
              </button>
            )}

            <ChevronDown
              size={18}
              style={{
                color: "var(--color-text-tertiary)",
                transition: "transform 0.2s",
                transform: isFocused ? "rotate(180deg)" : "rotate(0deg)",
                marginLeft: "auto",
              }}
            />
          </div>

          {/* Dropdown panel */}
          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                marginTop: 4,
                backgroundColor: "var(--color-surface-2)",
                border: "var(--border-default)",
                borderRadius: 6,
                boxShadow: "var(--shadow-dropdown)",
                maxHeight: 200,
                overflowY: "auto",
                zIndex: 1000,
              }}
              className="custom-scrollbar"
            >
              {filteredOptions.map((option) => {
                const isSelected = values.includes(
                  option.value,
                );
                return (
                  <div
                    key={option.value}
                    onClick={() => {
                      if (isSelected) {
                        onChange(
                          values.filter(
                            (v) => v !== option.value,
                          ),
                        );
                      } else {
                        handleSelectOption(option.value);
                      }
                    }}
                    style={{
                      padding: "8px 12px",
                      color: isSelected ? "var(--color-text-muted)" : "var(--color-text-secondary)",
                      fontSize: 13,
                      fontWeight: 400,
                      fontFamily: "Inter, sans-serif",
                      cursor: "pointer",
                      backgroundColor: "transparent",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor =
                          "var(--color-surface-4)";
                        e.currentTarget.style.color = "var(--color-text-primary)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "transparent";
                      e.currentTarget.style.color = isSelected
                        ? "var(--color-text-muted)"
                        : "var(--color-text-secondary)";
                    }}
                  >
                    {/* Checkbox */}
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 3,
                        border: `1px solid ${isSelected ? "var(--color-brand)" : "var(--color-surface-5)"}`,
                        backgroundColor: isSelected
                          ? "var(--color-brand)"
                          : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && (
                        <Check
                          size={11}
                          style={{ color: "var(--color-text-primary)" }}
                        />
                      )}
                    </div>
                    <span>
                      {highlightMatch(option.label, inputValue)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--color-surface-1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-surface-5);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}