import React from "react";
import { ChevronDown } from "lucide-react";

export const FORM_COLORS = {
  label: "var(--color-text-secondary)",
  placeholder: "var(--color-text-tertiary)",
  text: "var(--color-text-primary)",
  inputBg: "var(--color-surface-2)",
  border: "var(--color-surface-5)",
  cardBg: "var(--color-surface-3)",
  sectionHeading: "var(--color-text-primary)",
} as const;

const INPUT_HEIGHT = 40;
const INPUT_BORDER_RADIUS = 4;
const TEXTAREA_BORDER_RADIUS = 6;

const labelStyle: React.CSSProperties = {
  color: FORM_COLORS.label,
  fontSize: 14,
  fontWeight: 600,
  lineHeight: 1.5,
  letterSpacing: "1px",
  textTransform: "uppercase",
  paddingBottom: 6,
  display: "block",
  fontFamily: "Inter, sans-serif",
};

const baseInputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: FORM_COLORS.inputBg,
  border: `1px solid ${FORM_COLORS.border}`,
  borderRadius: INPUT_BORDER_RADIUS,
  padding: "0 12px",
  color: FORM_COLORS.text,
  fontSize: 14,
  fontFamily: "Inter, sans-serif",
  outline: "none",
};

interface FormLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  uppercase?: boolean;
}

export function FormLabel({ children, htmlFor, uppercase = true }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        ...labelStyle,
        ...(uppercase
          ? {}
          : { textTransform: "none", letterSpacing: "normal" }),
      }}
    >
      {children}
    </label>
  );
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  uppercaseLabel?: boolean;
}

export function FormInput({
  label,
  icon,
  rightIcon,
  uppercaseLabel = true,
  style,
  ...props
}: FormInputProps) {
  return (
    <div>
      {label && <FormLabel uppercase={uppercaseLabel}>{label}</FormLabel>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          {...props}
          style={{
            ...baseInputStyle,
            height: INPUT_HEIGHT,
            paddingLeft: icon ? 36 : 12,
            paddingRight: rightIcon ? 40 : 12,
            ...style,
          }}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  hasValue?: boolean;
  uppercaseLabel?: boolean;
}

export function FormSelect({
  label,
  options,
  hasValue,
  uppercaseLabel = true,
  style,
  ...props
}: FormSelectProps) {
  const showPlaceholderColor = !hasValue && !props.value;

  return (
    <div>
      {label && <FormLabel uppercase={uppercaseLabel}>{label}</FormLabel>}
      <div className="relative">
        <select
          {...props}
          style={{
            ...baseInputStyle,
            height: INPUT_HEIGHT,
            appearance: "none",
            paddingRight: 32,
            color: showPlaceholderColor ? FORM_COLORS.placeholder : FORM_COLORS.text,
            cursor: "pointer",
            ...style,
          }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: FORM_COLORS.placeholder }}
        />
      </div>
    </div>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  uppercaseLabel?: boolean;
}

export function FormTextarea({
  label,
  uppercaseLabel = true,
  style,
  ...props
}: FormTextareaProps) {
  return (
    <div>
      {label && <FormLabel uppercase={uppercaseLabel}>{label}</FormLabel>}
      <textarea
        {...props}
        style={{
          ...baseInputStyle,
          borderRadius: TEXTAREA_BORDER_RADIUS,
          height: 96,
          padding: 12,
          resize: "none",
          lineHeight: 1.5,
          ...style,
        }}
      />
    </div>
  );
}

interface FormToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  uppercaseLabel?: boolean;
}

export function FormToggle({
  label,
  checked,
  onChange,
  uppercaseLabel = true,
}: FormToggleProps) {
  return (
    <div className="flex items-center justify-between" style={{ paddingBottom: 6 }}>
      <span
        style={{
          ...labelStyle,
          paddingBottom: 0,
          ...(uppercaseLabel
            ? {}
            : { textTransform: "none" as const, letterSpacing: "normal" }),
        }}
      >
        {label}
      </span>
      
    </div>
  );
}