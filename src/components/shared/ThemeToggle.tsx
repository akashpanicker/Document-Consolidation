import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center justify-center cursor-pointer shrink-0"
      style={{
        width: 32,
        height: 32,
        borderRadius: "var(--border-radius-md)",
        backgroundColor: isHovered ? "var(--color-surface-4)" : "transparent",
        border: "none",
        padding: 0,
        transition: "background-color 0.2s ease, color 0.2s ease",
      }}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun
          size={18}
          style={{
            color: isHovered ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
            transition: "color 0.2s ease",
          }}
        />
      ) : (
        <Moon
          size={18}
          style={{
            color: isHovered ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
            transition: "color 0.2s ease",
          }}
        />
      )}
    </button>
  );
}
