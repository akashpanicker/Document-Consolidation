import { X } from "lucide-react";

interface MultiSelectChipsProps {
  label: string;
  selectedValues: string[];
  predefinedOptions: Array<{ value: string; label: string }>;
  customInputValue: string;
  onCustomInputChange: (value: string) => void;
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  placeholder?: string;
}

export function MultiSelectChips({
  label,
  selectedValues,
  predefinedOptions,
  customInputValue,
  onCustomInputChange,
  onAdd,
  onRemove,
  placeholder = "Type custom condition...",
}: MultiSelectChipsProps) {
  const handleAddCustom = () => {
    if (customInputValue.trim()) {
      onAdd(customInputValue.trim());
      onCustomInputChange("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustom();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        style={{
          color: "var(--text-secondary)",
          fontSize: 14,
          fontWeight: 500,
          letterSpacing: "1px",
          textTransform: "uppercase",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {label}
      </label>

      {/* Predefined option pills */}
      <div className="flex flex-wrap gap-2">
        {predefinedOptions.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={(e) => {
                if (isSelected) {
                  e.preventDefault();
                  onRemove(option.value);
                } else {
                  onAdd(option.value);
                }
              }}
              className="flex items-center gap-2"
              style={{
                backgroundColor: isSelected ? "var(--color-brand)" : "var(--bg-input)",
                border: `1px solid ${isSelected ? "var(--color-brand)" : "var(--raw-dark-surface-5)"}`,
                borderRadius: 4,
                padding: "6px 12px",
                color: isSelected ? "var(--text-on-primary)" : "var(--text-secondary)",
                fontSize: 12,
                fontWeight: 500,
                fontFamily: "Inter, sans-serif",
                cursor: "pointer",
              }}
            >
              <span>{option.label}</span>
              {isSelected && (
                <X
                  size={14}
                  color="#FFFFFF"
                  style={{ flexShrink: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(option.value);
                  }}
                />
              )}
            </button>
          );
        })}

        {/* Custom values as chips */}
        {selectedValues.map((value) => {
          const isPredefined = predefinedOptions.find((c) => c.value === value);
          if (isPredefined) return null;

          return (
            <button
              key={value}
              type="button"
              className="flex items-center gap-2"
              style={{
                backgroundColor: "var(--color-brand)",
                border: "1px solid var(--color-brand)",
                borderRadius: 4,
                padding: "6px 12px",
                color: "var(--text-on-primary)",
                fontSize: 12,
                fontWeight: 500,
                fontFamily: "Inter, sans-serif",
                cursor: "pointer",
              }}
            >
              <span>{value}</span>
              <X
                size={14}
                color="#FFFFFF"
                style={{ flexShrink: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(value);
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Custom input field */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={customInputValue}
          onChange={(e) => onCustomInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          style={{
            flex: 1,
            height: 32,
            backgroundColor: "var(--bg-input)",
            border: "var(--border-chip)",
            borderRadius: 4,
            padding: "0 12px",
            color: "var(--text-primary)",
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
            outline: "none",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-brand)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "")}
        />
        <button
          type="button"
          onClick={handleAddCustom}
          disabled={!customInputValue.trim()}
          style={{
            backgroundColor: customInputValue.trim() ? "var(--color-brand)" : "var(--bg-active)",
            border: "none",
            borderRadius: 4,
            padding: "6px 16px",
            color: "var(--text-on-primary)",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "Inter, sans-serif",
            cursor: customInputValue.trim() ? "pointer" : "not-allowed",
            opacity: customInputValue.trim() ? 1 : 0.5,
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}