import { useState, useRef, useEffect } from "react";
import { Globe, Check, Video, LogOut, LayoutGrid } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { ThemeToggle } from "./ThemeToggle";
import { useNavigate, useLocation } from "react-router";
import { useTheme } from "./ThemeContext";
import svgPaths from "../../imports/svg-ioq6ca64fj";

interface HeaderProps {
  breadcrumb?: string;
  userName?: string;
  userRole?: string;
  userInitials?: string;
  showOnlineStatus?: boolean;
  showUser?: boolean;
}

export function Header({
  breadcrumb = "Site Conditions",
  userName = "Marcos",
  userRole = "Drilling Manager",
  userInitials = "DM",
  showOnlineStatus = true,
  showUser = true,
}: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLayoutDropdown, setShowLayoutDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isBreadcrumbHovered, setIsBreadcrumbHovered] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [isLayoutHovered, setIsLayoutHovered] = useState(false);
  const [isUserHovered, setIsUserHovered] = useState(false);
  const { theme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const layoutDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLangDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (layoutDropdownRef.current && !layoutDropdownRef.current.contains(event.target as Node)) {
        setShowLayoutDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "en" as const, badge: "EN", label: "English" },
    { code: "es" as const, badge: "ES", label: "Español" },
  ];

  return (
    <div
      className="flex items-start px-[16px] pr-[24px] relative shrink-0"
      style={{
        backgroundColor: "var(--bg-header)",
        borderBottom: "var(--border-default)",
        height: 52,
      }}
    >
      {/* Left content */}
      <div className="flex flex-[1_0_0] gap-[20px] h-full items-center min-h-px min-w-px">
        {/* Logo */}
        <div className="flex flex-col h-full items-center justify-center relative shrink-0 p-[6px]">
          <div className="h-[46px] overflow-clip relative shrink-0 w-[66px]">
            <div className="absolute inset-[4.82%_3.33%_4.82%_3.39%]">
              {theme === "light" ? (
                <img src="/assets/HP logo (light mode).svg" alt="HP Logo" className="absolute block size-full" style={{ objectFit: 'contain' }} />
              ) : (
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 61.5636 41.5628">
                  <g>
                    <path d={svgPaths.p2d66ee00} fill="white" />
                    <path clipRule="evenodd" d={svgPaths.p2a422c00} fill="white" fillRule="evenodd" />
                    <path clipRule="evenodd" d={svgPaths.p2c449600} fill="white" fillRule="evenodd" />
                  </g>
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Title & Breadcrumb */}
        <div className="flex flex-col h-full items-start justify-center pb-[4px] relative shrink-0">
          <div className="flex gap-[8px] items-center mb-[-4px] relative shrink-0">
            <div
              className="flex flex-col font-['Inter',sans-serif] font-semibold justify-end leading-[0] not-italic relative shrink-0 text-[18px] whitespace-nowrap"
              style={{ color: "var(--text-primary)" }}
            >
              <p className="leading-[1.5] text-[16px]">{t("header.preJobPlanning")}</p>
            </div>
          </div>
          <div className="flex items-start mb-[-4px] relative shrink-0">
            <p
              className="font-['Inter',sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[14px] whitespace-nowrap"
              style={{
                color: "var(--color-text-secondary)",
              }}
            >
              {location.pathname === "/safety-videos" ? (
                <>
                  <span
                    style={{
                      color: isBreadcrumbHovered ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                      cursor: "pointer",
                      textDecoration: "underline",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={() => setIsBreadcrumbHovered(true)}
                    onMouseLeave={() => setIsBreadcrumbHovered(false)}
                    onClick={() => navigate("/briefing")}
                  >
                    {breadcrumb}
                  </span>
                  <span style={{ margin: "0 8px", color: "var(--color-text-tertiary)" }}>/</span>
                  <span
                    style={{
                      color: isVideoHovered ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                      cursor: "pointer",
                      textDecoration: "underline",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={() => setIsVideoHovered(true)}
                    onMouseLeave={() => setIsVideoHovered(false)}
                    onClick={() => navigate("/safety-videos")}
                  >
                    Safety Videos
                  </span>
                </>
              ) : (
                breadcrumb
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Middle content (empty) */}
      <div className="flex flex-[1_0_0] flex-col h-full items-center justify-center min-h-px min-w-px" />

      {/* Right content */}
      <div className="flex flex-[1_0_0] gap-[24px] h-full items-center justify-end min-h-px min-w-px">
        {/* Online Status Indicator */}
        {showOnlineStatus && (
          <div className="flex items-start relative shrink-0">
            <div
              className="flex gap-[8px] h-[24px] items-center pl-[12px] pr-[8px] relative rounded-[30px] shrink-0"
              style={{ backgroundColor: "var(--bg-online-badge)" }}
            >
              <div className="relative shrink-0 size-[8px]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" fill="var(--color-success)" r="4" />
                </svg>
              </div>
              <div
                className="flex flex-col font-['Inter',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center tracking-[0.15px] whitespace-nowrap"
                style={{ color: "var(--text-online)" }}
              >
                <p className="leading-none">{t("header.online")}</p>
              </div>
            </div>
          </div>
        )}

        {/* Video & Language Icons Group */}
        <div className="flex gap-[8px] items-center shrink-0">
          {/* Watch Safety Video Button - Only on Briefing Dashboard */}
          {(location.pathname === "/briefing" || location.pathname === "/briefing-v2") && (
            <div className="flex items-center gap-[8px]">
              {/* Layout Switcher */}
              <div ref={layoutDropdownRef} className="relative flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => setShowLayoutDropdown(!showLayoutDropdown)}
                  onMouseEnter={() => setIsLayoutHovered(true)}
                  onMouseLeave={() => setIsLayoutHovered(false)}
                  className="flex items-center justify-center cursor-pointer"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "var(--border-radius-md)",
                    backgroundColor: isLayoutHovered || showLayoutDropdown ? "var(--bg-hover)" : "transparent",
                    border: "none",
                    padding: 0,
                  }}
                >
                  <LayoutGrid
                    size={18}
                    style={{
                      color: showLayoutDropdown
                        ? "var(--color-brand)"
                        : isLayoutHovered
                          ? "var(--color-text-primary)"
                          : "var(--color-text-tertiary)",
                    }}
                  />
                </button>

                {/* Layout Dropdown */}
                {showLayoutDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      marginTop: 6,
                      width: 160,
                      backgroundColor: "var(--bg-card)",
                      border: "var(--border-default)",
                      borderRadius: "var(--border-radius-lg)",
                      boxShadow: "var(--shadow-dropdown)",
                      padding: "6px 0",
                      zIndex: 1000,
                    }}
                  >
                    <div
                      style={{
                        padding: "8px 12px",
                        borderBottom: "var(--border-default)",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--color-text-tertiary)",
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        LAYOUTS
                      </span>
                    </div>

                    {/* Layout 1 Option */}
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/briefing");
                        setShowLayoutDropdown(false);
                      }}
                      className="w-full cursor-pointer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 12px",
                        backgroundColor: location.pathname === "/briefing" ? "var(--bg-active)" : "transparent",
                        border: "none",
                        borderLeft: location.pathname === "/briefing" ? "3px solid var(--color-brand)" : "3px solid transparent",
                        textAlign: "left",
                        fontFamily: "Inter, sans-serif",
                      }}
                      onMouseEnter={(e) => {
                        if (location.pathname !== "/briefing") e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                      }}
                      onMouseLeave={(e) => {
                        if (location.pathname !== "/briefing") e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <span
                        style={{
                          flex: 1,
                          color: location.pathname === "/briefing" ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                          fontSize: 13,
                          fontWeight: 400,
                        }}
                      >
                        Layout 1
                      </span>
                      {location.pathname === "/briefing" && (
                        <Check size={14} style={{ color: "var(--color-success)", flexShrink: 0 }} />
                      )}
                    </button>

                    {/* Layout 2 Option */}
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/briefing-v2");
                        setShowLayoutDropdown(false);
                      }}
                      className="w-full cursor-pointer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 12px",
                        backgroundColor: location.pathname === "/briefing-v2" ? "var(--bg-active)" : "transparent",
                        border: "none",
                        borderLeft: location.pathname === "/briefing-v2" ? "3px solid var(--color-brand)" : "3px solid transparent",
                        textAlign: "left",
                        fontFamily: "Inter, sans-serif",
                      }}
                      onMouseEnter={(e) => {
                        if (location.pathname !== "/briefing-v2") e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                      }}
                      onMouseLeave={(e) => {
                        if (location.pathname !== "/briefing-v2") e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <span
                        style={{
                          flex: 1,
                          color: location.pathname === "/briefing-v2" ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                          fontSize: 13,
                          fontWeight: 400,
                        }}
                      >
                        Layout 2
                      </span>
                      {location.pathname === "/briefing-v2" && (
                        <Check size={14} style={{ color: "var(--color-success)", flexShrink: 0 }} />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Watch Safety Video Button */}
              <button
                type="button"
                onClick={() => navigate("/safety-videos")}
                onMouseEnter={() => setIsVideoHovered(true)}
                onMouseLeave={() => setIsVideoHovered(false)}
                className="flex items-center justify-center cursor-pointer shrink-0"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "var(--border-radius-md)",
                  backgroundColor: isVideoHovered ? "var(--bg-hover)" : "transparent",
                  border: "none",
                  padding: 0,
                }}
              >
                <Video
                  size={18}
                  style={{
                    color: isVideoHovered ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
                  }}
                />
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Switcher */}
          <div ref={dropdownRef} className="relative flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="flex flex-col items-center justify-center cursor-pointer"
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--border-radius-md)",
                backgroundColor: isHovered || showLangDropdown ? "var(--bg-hover)" : "transparent",
                border: "none",
                padding: 0,
                position: "relative",
              }}
            >
              <Globe
                size={18}
                style={{
                  color: showLangDropdown
                    ? "var(--color-brand)"
                    : isHovered
                      ? "var(--color-text-primary)"
                      : "var(--color-text-tertiary)",
                }}
              />
              <span
                style={{
                  color: "var(--color-text-tertiary)",
                  fontSize: 9,
                  fontWeight: 600,
                  fontFamily: "Inter, sans-serif",
                  lineHeight: 1,
                  marginTop: 1,
                }}
              >
                {language.toUpperCase()}
              </span>
            </button>

            {/* Dropdown */}
            {showLangDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: 6,
                  width: 160,
                  backgroundColor: "var(--bg-card)",
                  border: "var(--border-default)",
                  borderRadius: "var(--border-radius-lg)",
                  boxShadow: "var(--shadow-dropdown)",
                  padding: "6px 0",
                  zIndex: 1000,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "8px 12px",
                    borderBottom: "var(--border-default)",
                  }}
                >
                  <span
                    style={{
                      color: "var(--color-text-tertiary)",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {t("lang.language")}
                  </span>
                </div>

                {/* Options */}
                {languages.map((lang) => {
                  const isActive = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLangDropdown(false);
                      }}
                      className="w-full cursor-pointer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 12px",
                        backgroundColor: isActive ? "var(--bg-active)" : "transparent",
                        border: "none",
                        borderLeft: isActive ? "3px solid var(--color-brand)" : "3px solid transparent",
                        textAlign: "left",
                        fontFamily: "Inter, sans-serif",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: "var(--bg-hover)",
                          border: "var(--border-active)",
                          borderRadius: "var(--border-radius-sm)",
                          padding: "2px 6px",
                          color: "var(--color-text-primary)",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {lang.badge}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          color: isActive ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                          fontSize: 13,
                          fontWeight: 400,
                        }}
                      >
                        {lang.label}
                      </span>
                      {isActive && (
                        <Check size={14} style={{ color: "var(--color-success)", flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* User */}
        {showUser && (
          <div ref={userDropdownRef} className="relative flex gap-[8px] items-center shrink-0">
            <div
              className="flex gap-[8px] items-center cursor-pointer"
              style={{
                borderRadius: "var(--border-radius-md)",
                padding: "4px 8px 4px 4px",
                backgroundColor: isUserHovered || showUserDropdown ? "var(--bg-hover)" : "transparent",
                transition: "background-color 0.2s",
              }}
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              onMouseEnter={() => setIsUserHovered(true)}
              onMouseLeave={() => setIsUserHovered(false)}
            >
              {/* Avatar */}
              <div className="flex items-start relative shrink-0">
                <div className="relative shrink-0 size-[40px]">
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[30px] size-[40px]"
                    style={{ backgroundColor: "var(--bg-hover)" }}
                  />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[24px]">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                      <path d={svgPaths.p27c6f00} fill="var(--color-text-secondary)" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Name & Role */}
              <div className="flex flex-col gap-[4px] items-start leading-[0] not-italic relative shrink-0 tracking-[0.15px] whitespace-nowrap">
                <div
                  className="flex flex-col font-['Inter',sans-serif] font-semibold justify-end relative shrink-0 text-[14px]"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <p className="leading-none">{userName}</p>
                </div>
                <div
                  className="flex flex-col font-['Inter',sans-serif] font-normal justify-end relative shrink-0 text-[12px]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <p className="leading-none">{userRole}</p>
                </div>
              </div>
            </div>

            {/* User Dropdown */}
            {showUserDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: 6,
                  width: 160,
                  backgroundColor: "var(--bg-card)",
                  border: "var(--border-default)",
                  borderRadius: "var(--border-radius-lg)",
                  boxShadow: "var(--shadow-dropdown)",
                  padding: "6px 0",
                  zIndex: 1000,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    navigate("/");
                  }}
                  className="w-full cursor-pointer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 12px",
                    backgroundColor: "transparent",
                    border: "none",
                    textAlign: "left",
                    fontFamily: "Inter, sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--bg-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <LogOut
                    size={16}
                    style={{
                      color: "var(--color-text-secondary)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      flex: 1,
                      color: "var(--color-text-secondary)",
                      fontSize: 13,
                      fontWeight: 400,
                    }}
                  >
                    {t("user.logout")}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}