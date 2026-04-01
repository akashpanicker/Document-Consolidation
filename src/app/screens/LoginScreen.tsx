import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Form from "../../imports/Form";
import { Header } from "../components/Header";
import { useTranslation } from "react-i18next";

export function LoginScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (d: Date) => {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    let hours = d.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const mins = d.getMinutes().toString().padStart(2, "0");
    return `${day} ${date} ${month} ${year} — ${hours.toString().padStart(2, "0")}:${mins} ${ampm}`;
  };

  return (
    <div
      className="flex flex-col h-screen w-screen"
      style={{ backgroundColor: "var(--bg-page)", fontFamily: "Inter, sans-serif" }}
    >
      {/* Header */}
      <Header breadcrumb={t("login.title")} showOnlineStatus={false} showUser={false} />

      {/* Grid texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          opacity: 0.04,
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(255,255,255,0.1) 35px,
            rgba(255,255,255,0.1) 36px
          )`,
        }}
      />

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div style={{ width: 420 }}>
          <Form onNavigate={navigate} />
        </div>
      </div>

      {/* Bottom status bar */}
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{
          height: 32,
          backgroundColor: "var(--bg-bottom-bar)",
          borderTop: "var(--border-default)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="rounded-full"
            style={{ width: 6, height: 6, backgroundColor: "var(--color-success)" }}
          />
          <span style={{ color: "var(--color-success)", fontSize: 14, fontWeight: 500 }}>{t("login.systemOnline")}</span>
        </div>
        <span style={{ color: "var(--color-text-muted)", fontSize: 14, fontWeight: 400 }}>
          {formatTime(currentTime)}
        </span>
      </div>
    </div>
  );
}
