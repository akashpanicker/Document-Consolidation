import { useState, useEffect, useRef } from "react";
import { X, CheckCircle, AlertTriangle, ShieldAlert, FileText, Info, Sparkles, RotateCcw, ExternalLink, ChevronDown } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useTranslation } from "react-i18next";

export interface SourceContribution {
  documentName: string;
  origin: 'H&P' | 'KCAD';
  percentage: number;
  url?: string;
}

export interface ParagraphData {
  id: string;
  sectionId: string;
  text: string;
  sourceDocument: string;
  origin: 'H&P' | 'KCAD';
  applicability: string;
  lastVerified: string;
  regulatoryReferences: string[];
  aiConfidence: 'High' | 'Medium' | 'Low';
  aiReason: string;
  conflict?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
  hpPercent: number;
  kcadPercent: number;
  isEdited?: boolean;
  originalText?: string;
  sourceDocumentUrl?: string;
  excludedExcerpts?: string[];
  sources?: SourceContribution[];
}

/* ──────────────────────────────────────────────
 *  AI Confidence Card — pinned at top of right panel
 * ────────────────────────────────────────────── */
interface AIConfidenceCardProps {
  data: ParagraphData | null;
}

export function AIConfidenceCard({ data }: AIConfidenceCardProps) {
  const { t } = useTranslation();
  const [barAnimated, setBarAnimated] = useState(false);
  const prevIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!data) { setBarAnimated(false); return; }
    if (data.id !== prevIdRef.current) {
      setBarAnimated(false);
      prevIdRef.current = data.id;
      const t = setTimeout(() => setBarAnimated(true), 80);
      return () => clearTimeout(t);
    }
  }, [data?.id]);

  const hasConflict = !!data?.conflict;

  if (!data) {
    return (
      <div
        className="flex flex-col gap-3 px-4 py-5"
        style={{ borderBottom: "var(--border-default)" }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 shrink-0" style={{ color: "var(--text-muted)", opacity: 0.4 }} />
          <span className="text-[13px] font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            {t("review.aiConfidence")}
          </span>
        </div>
        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
          {t("review.selectParagraph")}
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-3 px-4 py-4"
      style={{ borderBottom: "var(--border-default)" }}
    >
      {/* Conflict banner */}
      {hasConflict && (
        <div
          className="flex items-start gap-2.5 p-2.5 rounded-[8px] mb-1"
          style={{
            backgroundColor: "var(--color-error-bg)",
            border: "1px solid var(--color-negative)",
          }}
        >
          <AlertTriangle className="w-[16px] h-[16px] shrink-0 mt-0.5" style={{ color: "var(--color-negative)" }} />
          <div className="flex flex-col gap-0.5">
            <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color: "var(--color-negative)" }}>
              {t("review.originConflict")}
            </span>
            <span className="text-[12px] font-medium leading-snug" style={{ color: "var(--color-negative)" }}>
              {data.conflict}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 shrink-0" style={{ color: "var(--color-brand)" }} />
        <span className="text-[13px] font-bold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
          {t("review.aiConfidence")}
        </span>
      </div>

      {/* Segmented bar */}
      <div
        className="w-full h-[8px] rounded-full overflow-hidden flex"
        style={{ backgroundColor: "var(--bg-hover)" }}
      >
        <div
          style={{
            width: barAnimated ? `${data.hpPercent}%` : "0%",
            backgroundColor: "var(--color-brand)",
            transition: "width 400ms ease-out",
            borderRadius: data.hpPercent === 100 ? "9999px" : "9999px 0 0 9999px",
          }}
        />
        <div
          style={{
            width: barAnimated ? `${data.kcadPercent}%` : "0%",
            backgroundColor: hasConflict ? "var(--color-negative)" : "var(--text-muted)",
            transition: "width 400ms ease-out 50ms",
            borderRadius: data.kcadPercent === 100 ? "9999px" : "0 9999px 9999px 0",
          }}
        />
      </div>

      {/* Percentage labels */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-semibold" style={{ color: "var(--color-brand)" }}>
          {data.hpPercent}% H&P
        </span>
        <span
          className="text-[12px] font-semibold"
          style={{ color: hasConflict ? "var(--color-negative)" : "var(--text-muted)" }}
        >
          {data.kcadPercent}% KCAD
        </span>
      </div>

      {/* AI reason note */}
      <p className="text-[12px] flex items-start gap-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        <Info className="w-[14px] h-[14px] shrink-0 mt-0.5" style={{ color: "var(--text-tertiary)" }} />
        {data.aiReason}
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────
 *  Annotation Details Card — source, refs, actions
 * ────────────────────────────────────────────── */
interface AnnotationCalloutProps {
  data: ParagraphData;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onRevert?: () => void;
  onClose: () => void;
}

export function AnnotationCallout({ data, onApprove, onReject, onRevert, onClose }: AnnotationCalloutProps) {
  const { t } = useTranslation();
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReasonText, setRejectReasonText] = useState(data.rejectReason || "");
  const [entered, setEntered] = useState(false);
  const [rejectAreaHeight, setRejectAreaHeight] = useState(0);
  const rejectRef = useRef<HTMLDivElement>(null);
  const [excludedOpen, setExcludedOpen] = useState(false);
  const [excludedHeight, setExcludedHeight] = useState(0);
  const excludedRef = useRef<HTMLDivElement>(null);

  const hasConflict = !!data.conflict;

  useEffect(() => {
    setRejectMode(false);
    setRejectReasonText(data.rejectReason || "");
    setEntered(false);
    setExcludedOpen(false);
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [data.id]);

  useEffect(() => {
    if (rejectMode && rejectRef.current) {
      setRejectAreaHeight(rejectRef.current.scrollHeight);
    }
  }, [rejectMode]);

  useEffect(() => {
    if (excludedOpen && excludedRef.current) {
      setExcludedHeight(excludedRef.current.scrollHeight);
    }
  }, [excludedOpen]);

  const handleRejectSubmit = () => {
    onReject(rejectReasonText);
    setRejectMode(false);
  };

  return (
    <div
      style={{
        transformOrigin: "top center",
        transition: "opacity 250ms ease-out, transform 250ms ease-out",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(6px)",
      }}
    >
      <Card
        className="w-full pointer-events-auto rounded-[12px] flex flex-col overflow-hidden relative"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "var(--border-default)",
          boxShadow: "var(--shadow-modal)",
        }}
      >
        {/* ── Source & Origin ── */}
        <div className="flex flex-col gap-4 px-4 pt-4 pb-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <FileText className="w-[14px] h-[14px]" style={{ color: "var(--color-brand)" }} />
              <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
                {t("review.source")}
              </span>
              <Badge
                variant="outline"
                className="ml-1 text-[10px] h-5 font-semibold"
                style={{
                  backgroundColor: data.origin === 'H&P' ? "rgba(43,85,151,0.1)" : "rgba(17,104,68,0.1)",
                  color: data.origin === 'H&P' ? "var(--color-brand)" : "var(--color-positive)",
                  borderColor: data.origin === 'H&P' ? "rgba(43,85,151,0.25)" : "rgba(17,104,68,0.25)",
                }}
              >
                {data.origin} {t("review.origin")}
              </Badge>
            </div>
            <a
              href={data.sourceDocumentUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[13px] font-semibold"
              style={{ color: "var(--color-brand)", textDecoration: "none" }}
              onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
              onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
            >
              {data.sourceDocument}
              <ExternalLink className="w-[12px] h-[12px] shrink-0" />
            </a>
          </div>

          {/* ── Applicability ── */}
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
              {t("review.applicability")}
            </span>
            <span className="text-[12px]" style={{ color: "var(--text-primary)" }}>{data.applicability}</span>
          </div>

          {/* ── Regulatory Links ── */}
          {data.regulatoryReferences.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
                {t("review.regulatoryReferences")}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {data.regulatoryReferences.map((ref, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-[12px] font-medium px-2 py-0.5"
                    style={{
                      backgroundColor: "var(--bg-hover)",
                      color: "var(--text-primary)",
                      border: "var(--border-subtle)",
                    }}
                  >
                    {ref}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* ── Last Verified ── */}
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
              {t("review.lastVerified")}
            </span>
            <span className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>{data.lastVerified}</span>
          </div>

          {/* ── What Was Excluded ── */}
          {data.excludedExcerpts && data.excludedExcerpts.length > 0 && (
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setExcludedOpen(!excludedOpen)}
                className="flex items-center justify-between w-full"
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
              >
                <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
                  What Was Excluded
                </span>
                <ChevronDown
                  className="w-[14px] h-[14px] shrink-0"
                  style={{
                    color: "var(--text-muted)",
                    transform: excludedOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 200ms ease-out",
                  }}
                />
              </button>
              {!excludedOpen && (
                <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  Content from source documents not carried into this chunk
                </span>
              )}
              <div
                ref={excludedRef}
                style={{
                  maxHeight: excludedOpen ? excludedHeight + 16 : 0,
                  overflow: "hidden",
                  transition: "max-height 200ms ease-out",
                }}
              >
                <div className="flex flex-col gap-2 pt-1">
                  {data.excludedExcerpts.map((excerpt, idx) => (
                    <div
                      key={idx}
                      className="pl-3 py-1"
                      style={{ borderLeft: "2px solid var(--border-default)" }}
                    >
                      <span className="text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        {excerpt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="h-px w-full my-1" style={{ backgroundColor: "var(--bg-hover)" }} />

          {/* ── Actions ── */}
          <div className="flex flex-col gap-3">
            {!rejectMode && (
              <div className="flex gap-2">
                {hasConflict ? (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1 h-9 font-semibold text-[13px] transition-all duration-200"
                      style={{
                        borderColor: "var(--color-brand)",
                        color: "var(--color-brand)",
                      }}
                      onClick={onApprove}
                    >
                      <CheckCircle className="w-[14px] h-[14px] mr-1.5" />
                      {t("review.approveButton")}
                    </Button>
                    <Button
                      className="flex-1 h-9 font-semibold text-[13px] transition-all duration-200"
                      style={{
                        backgroundColor: "var(--color-negative)",
                        color: "var(--text-on-primary)",
                      }}
                      onClick={() => setRejectMode(true)}
                    >
                      <ShieldAlert className="w-[14px] h-[14px] mr-1.5" />
                      {t("review.rejectButton")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="flex-1 h-9 font-semibold text-[13px] shadow-sm transition-all duration-200"
                      style={{
                        backgroundColor: "var(--color-brand)",
                        color: "var(--text-on-primary)",
                      }}
                      onClick={onApprove}
                    >
                      <CheckCircle className="w-[14px] h-[14px] mr-1.5" />
                      {t("review.approveButton")}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-9 font-semibold text-[13px] transition-all duration-200"
                      style={{
                        borderColor: "var(--color-negative)",
                        color: "var(--color-negative)",
                      }}
                      onClick={() => setRejectMode(true)}
                    >
                      <ShieldAlert className="w-[14px] h-[14px] mr-1.5" />
                      {t("review.rejectButton")}
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Reject reason area — animated max-height slide */}
            <div
              ref={rejectRef}
              style={{
                maxHeight: rejectMode ? rejectAreaHeight + 16 : 0,
                opacity: rejectMode ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 200ms ease-out, opacity 200ms ease-out",
              }}
            >
              <div className="flex flex-col gap-3 pt-1">
                <span className="text-[13px] font-semibold" style={{ color: "var(--color-negative)" }}>
                  {t("review.rejectionReason")}
                </span>
                <Textarea
                  value={rejectReasonText}
                  onChange={(e) => setRejectReasonText(e.target.value)}
                  placeholder={t("review.rejectionPlaceholder")}
                  className="text-[13px] bg-transparent"
                  style={{ border: "var(--border-input)" }}
                  rows={3}
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setRejectMode(false)}
                    className="text-[13px] h-8"
                    style={{ border: "var(--border-default)" }}
                  >
                    {t("review.cancel")}
                  </Button>
                  <Button
                    onClick={handleRejectSubmit}
                    className="text-[13px] h-8"
                    style={{
                      backgroundColor: "var(--color-negative)",
                      color: "var(--text-on-primary)",
                    }}
                    disabled={!rejectReasonText.trim()}
                  >
                    {t("review.submitRejection")}
                  </Button>
                </div>
              </div>
            </div>

            {/* Revert Original block */}
            {data.isEdited && onRevert && (
              <>
                <div className="h-px w-full my-1" style={{ backgroundColor: "var(--bg-hover)" }} />
                <Button
                  variant="ghost"
                  className="w-full text-[12px] h-8 transition-colors duration-150 justify-start px-2"
                  style={{ color: "var(--text-secondary)" }}
                  onClick={onRevert}
                >
                  <RotateCcw className="w-[14px] h-[14px] mr-2" />
                  {t("review.revertButton")}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Close button — top right */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-1.5 rounded-md transition-colors duration-150"
          style={{ color: "var(--text-tertiary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <X size={16} />
        </button>
      </Card>
    </div>
  );
}
