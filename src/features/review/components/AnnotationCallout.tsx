import { useState, useEffect, useRef } from "react";
import { X, CheckCircle, AlertTriangle, ShieldAlert, FileText, Info, Sparkles, RotateCcw, ExternalLink, ChevronDown, MessageSquare, CornerDownRight, Send } from "lucide-react";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { UnderlineTabs, UnderlineTabsList, UnderlineTabsTrigger, UnderlineTabsContent } from "../../../components/ui/underline-tabs";
import { Avatar, AvatarImage, AvatarFallback } from "../../../components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../../../components/ui/tooltip";
import { useTranslation } from "react-i18next";

export interface SourceContribution {
  documentName: string;
  origin: 'H&P' | 'KCAD';
  percentage: number;
  documentUrl?: string;
}

export interface CommentData {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  body: string;
  mentions?: string[];
  resolved?: boolean;
  replies?: CommentData[];
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
  aiConfidenceScore: number;
  aiReason: string;
  conflict?: string;
  status: 'pending' | 'approved' | 'rejected' | 'auto-approved';
  rejectReason?: string;
  hpPercent: number;
  kcadPercent: number;
  isEdited?: boolean;
  originalText?: string;
  excludedExcerpts?: string[];
  originalExcludedExcerpts?: string[];
  sources?: SourceContribution[];
  appendixName?: string;
  suggestedForAppendix?: boolean;
  suggestedAppendixName?: string;
  comments?: CommentData[];
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
          <span className="text-[14px] font-bold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
            {t("review.aiConfidence")}
          </span>
        </div>
        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
          {t("review.selectParagraph")}
        </p>
      </div>
    );
  }

  const confidenceValue = data.aiConfidence; // High, Medium, Low
  let confidenceColor = "var(--text-muted)";
  if (confidenceValue === "High") confidenceColor = "var(--color-positive)";
  else if (confidenceValue === "Medium") confidenceColor = "var(--color-warning)";
  else if (confidenceValue === "Low") confidenceColor = "var(--color-negative)";

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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 shrink-0" style={{ color: "var(--color-brand)" }} />
          <span className="text-[14px] font-bold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
            {t("review.aiConfidence")}
          </span>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] font-bold px-2 py-0.5"
          style={{
            color: confidenceColor,
            borderColor: confidenceValue === 'Medium' ? '#B6974D' : `${confidenceColor}70`,
            backgroundColor: `${confidenceColor}10`
          }}
        >
          {confidenceValue} Confidence
        </Badge>
      </div>


      {/* Manual review vs AI approved status line */}
      <div className="flex items-center gap-1.5 pt-1">
        {data.status === 'auto-approved' ? (
          <>
            <CheckCircle className="w-3.5 h-3.5" style={{ color: "var(--color-positive)" }} />
            <span className="text-[11px] font-bold" style={{ color: "var(--color-positive)" }}>
              Auto-approved by AI
            </span>
          </>
        ) : (
          <>
            <ShieldAlert className="w-3.5 h-3.5" style={{ color: confidenceColor }} />
            <span className="text-[11px] font-bold" style={{ color: confidenceColor }}>
              Requires Manual Review
            </span>
          </>
        )}
      </div>
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
  onMoveToAppendix?: (id: string, newAppName: string) => void;
  onReinclude?: (id: string, excerptIndex: number, excerptText: string) => void;
  onAddComment?: (paragraphId: string, text: string, mentions?: string[]) => void;
  onResolveComment?: (paragraphId: string, commentId: string) => void;
  existingAppendices?: string[];
  onClose: () => void;
}

export function AnnotationCallout({ data, onApprove, onReject, onRevert, onMoveToAppendix, onReinclude, onAddComment, onResolveComment, existingAppendices = [], onClose }: AnnotationCalloutProps) {
  const { t } = useTranslation();
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReasonText, setRejectReasonText] = useState(data.rejectReason || "");
  const [entered, setEntered] = useState(false);
  const [rejectAreaHeight, setRejectAreaHeight] = useState(0);
  const rejectRef = useRef<HTMLDivElement>(null);
  const [excludedOpen, setExcludedOpen] = useState(false);
  const [excludedHeight, setExcludedHeight] = useState(0);
  const excludedRef = useRef<HTMLDivElement>(null);
  const [movePopoverOpen, setMovePopoverOpen] = useState(false);
  const [newAppendixName, setNewAppendixName] = useState("");
  const [removingExcerpts, setRemovingExcerpts] = useState<number[]>([]);

  const hasConflict = !!data.conflict;

  useEffect(() => {
    setRejectMode(false);
    setRejectReasonText(data.rejectReason || "");
    setEntered(false);
    setExcludedOpen(false);
    setMovePopoverOpen(false);
    setRemovingExcerpts([]);
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [data.id]);

  useEffect(() => {
    if (data.excludedExcerpts?.length === 0 && excludedOpen) {
      setExcludedOpen(false);
    }
  }, [data.excludedExcerpts?.length, excludedOpen]);

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

  const [activeTab, setActiveTab] = useState<"details" | "comments">("details");
  const [showResolved, setShowResolved] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showMentions, setShowMentions] = useState(false);

  // List of possible mentions
  const mentionUsers = ["John Doe", "Marcos", "Sarah Smith", "Raleigh"];

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCommentText(val);
    if (val.endsWith("@")) setShowMentions(true);
    else if (!val.includes("@")) setShowMentions(false);
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim() || !onAddComment) return;
    const mentions = mentionUsers.filter(u => commentText.includes(`@${u}`));
    onAddComment(data.id, commentText, mentions);
    setCommentText("");
    setShowMentions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setCommentText("");
      setShowMentions(false);
    }
  };

  const unresolvedCount = data.comments?.filter(c => !c.resolved).length || 0;
  const displayComments = data.comments?.filter(c => showResolved ? true : !c.resolved) || [];

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
        <UnderlineTabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex flex-col h-full w-full">
          <div className="flex w-full" style={{ borderBottom: 'var(--border-default)' }}>
            <UnderlineTabsList className="w-full">
              <UnderlineTabsTrigger value="details" fullWidth hideSeparator>
                Details
              </UnderlineTabsTrigger>
              <UnderlineTabsTrigger value="comments" fullWidth hideSeparator>
                Comments
                {unresolvedCount > 0 && (
                  <Badge variant="secondary" className="px-1.5 py-0 h-4 text-[10px] rounded-full ml-1.5" style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)' }}>
                    {unresolvedCount}
                  </Badge>
                )}
              </UnderlineTabsTrigger>
            </UnderlineTabsList>
          </div>

          <UnderlineTabsContent value="details" className="m-0 border-0 outline-none flex flex-col w-full data-[state=inactive]:hidden">
            <div className="flex flex-col gap-4 px-4 pt-4 pb-4">
              {/* ── Sources ── */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-[14px] h-[14px]" style={{ color: "var(--color-brand)" }} />
                  <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
                    {data.sources && data.sources.length > 1 ? t("review.sources", "SOURCES") : t("review.source", "SOURCE")}
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {(data.sources || []).sort((a, b) => b.percentage - a.percentage).map((src, i) => (
                    <div key={i} className="flex flex-col gap-1.5 pl-[22px]">
                      <a
                        href={src.documentUrl ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[13px] font-semibold"
                        style={{ color: "var(--color-brand)", textDecoration: "none" }}
                        onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                      >
                        {src.documentName}
                        <ExternalLink className="w-[12px] h-[12px] shrink-0" />
                      </a>
                    </div>
                  ))}
                </div>
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
              {((data.excludedExcerpts && data.excludedExcerpts.length > 0) || (data.originalExcludedExcerpts && data.originalExcludedExcerpts.length > 0)) && (
                <div className="flex flex-col gap-1">
                  {(!data.excludedExcerpts || data.excludedExcerpts.length === 0) ? (
                    <div className="flex flex-col gap-1 mt-1">
                      <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
                        What Was Excluded
                      </span>
                      <span className="text-[11px] italic" style={{ color: "var(--text-muted)" }}>
                        All excluded content has been re-included
                      </span>
                    </div>
                  ) : (
                    <>
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
                          {data.excludedExcerpts.map((excerpt, idx) => {
                            const isRemoving = removingExcerpts.includes(idx);
                            return (
                              <div
                                key={`${data.id}-exc-${idx}`}
                                className="pl-3 py-1 flex flex-col gap-2"
                                style={{
                                  borderLeft: "2px solid var(--border-default)",
                                  opacity: isRemoving ? 0 : 1,
                                  maxHeight: isRemoving ? 0 : 500,
                                  margin: isRemoving ? 0 : undefined,
                                  paddingTop: isRemoving ? 0 : undefined,
                                  paddingBottom: isRemoving ? 0 : undefined,
                                  overflow: "hidden",
                                  transition: "all 150ms ease-out"
                                }}
                              >
                                <span className="text-[12px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                                  {excerpt}
                                </span>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    className="h-6 px-2 text-[11px] font-semibold"
                                    style={{ color: "var(--color-brand)" }}
                                    disabled={isRemoving}
                                    onClick={() => {
                                      setRemovingExcerpts(prev => [...prev, idx]);
                                      setTimeout(() => {
                                        if (onReinclude) onReinclude(data.id, idx, excerpt);
                                      }, 150);
                                    }}
                                  >
                                    Re-include
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="h-6 px-2 text-[11px] font-semibold"
                                    style={{ color: "var(--color-secondary, #8B5CF6)" }}
                                    onClick={() => {
                                      setNewAppendixName(data.suggestedAppendixName || `Appendix ${String.fromCharCode(65 + existingAppendices.length)} — `);
                                      setMovePopoverOpen(true);
                                    }}
                                  >
                                    Add to Appendix
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
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
                            borderColor: "var(--color-positive)",
                            color: "var(--color-positive)",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(17,104,68,0.08)"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          onClick={onApprove}
                        >
                          <CheckCircle className="w-[14px] h-[14px] mr-1.5" />
                          {t("review.approveButton")}
                        </Button>
                        <TooltipProvider delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className="flex-1 h-9 font-semibold text-[13px] transition-all duration-200 cursor-pointer"
                                style={{
                                  backgroundColor: "var(--color-negative)",
                                  color: "var(--text-on-primary)",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                                onClick={() => setRejectMode(true)}
                              >
                                <ShieldAlert className="w-[14px] h-[14px] mr-1.5" />
                                {t("review.rejectButton")}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" align="end" className="max-w-[200px] text-center">
                              {t("review.rejectTooltip", "This chunk will be excluded from the final document")}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1 h-9 font-semibold text-[13px] shadow-sm transition-all duration-200 cursor-pointer"
                          style={{
                            borderColor: "var(--color-positive)",
                            color: "var(--color-positive)",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(17,104,68,0.08)"}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                          onClick={onApprove}
                        >
                          <CheckCircle className="w-[14px] h-[14px] mr-1.5" />
                          {t("review.approveButton")}
                        </Button>
                        <TooltipProvider delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                className="flex-1 h-9 font-semibold text-[13px] transition-all duration-200"
                                style={{
                                  borderColor: "var(--color-negative)",
                                  color: "var(--color-negative)",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-error-bg)"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                onClick={() => setRejectMode(true)}
                              >
                                <ShieldAlert className="w-[14px] h-[14px] mr-1.5" />
                                {t("review.rejectButton")}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" align="end" className="max-w-[200px] text-center">
                              {t("review.rejectTooltip", "This chunk will be excluded from the final document")}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
                  </div>
                )}

                {/* Move to Appendix button */}
                {!rejectMode && !movePopoverOpen && (
                  <Button
                    variant="outline"
                    className="w-full h-9 font-semibold text-[13px] relative group"
                    style={{
                      borderColor: "var(--color-brand)",
                      color: "var(--color-brand)",
                    }}
                    onClick={() => {
                      setNewAppendixName(data.suggestedAppendixName || `Appendix ${String.fromCharCode(65 + existingAppendices.length)} — `);
                      setMovePopoverOpen(true);
                    }}
                  >
                    <ChevronDown className="w-[14px] h-[14px] mr-1.5 -rotate-90 group-hover:translate-x-1 transition-transform" />
                    {t("review.moveToAppendix", "Move to Appendix")}
                  </Button>
                )}

                {/* Move to Appendix popover content */}
                {movePopoverOpen && (
                  <div
                    className="flex flex-col gap-3 p-3 rounded-[8px] animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{ border: "1px solid #D0D8E8" }}
                  >
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                        Appendix name
                      </label>
                      <Input
                        value={newAppendixName}
                        onChange={(e) => setNewAppendixName(e.target.value)}
                        placeholder="e.g. Appendix A — KSA Requirements"
                        className="h-8 text-[13px]"
                        autoFocus
                      />
                    </div>
                    {existingAppendices.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                          Add to existing
                        </label>
                        <Select
                          onValueChange={(val) => {
                            if (val) setNewAppendixName(val);
                          }}
                          value={existingAppendices.includes(newAppendixName) ? newAppendixName : ""}
                        >
                          <SelectTrigger size="sm" className="text-[13px]">
                            <SelectValue placeholder="Select an appendix..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {existingAppendices.map(app => (
                                <SelectItem key={app} value={app}>{app}</SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="flex gap-2 justify-end mt-1">
                      <Button
                        variant="ghost"
                        onClick={() => setMovePopoverOpen(false)}
                        className="text-[12px] h-7 px-3"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          if (onMoveToAppendix && newAppendixName.trim()) {
                            onMoveToAppendix(data.id, newAppendixName.trim());
                            setMovePopoverOpen(false);
                          }
                        }}
                        className="text-[12px] h-7 px-3 font-semibold"
                        style={{ backgroundColor: "var(--color-brand)", color: "var(--text-on-primary)" }}
                        disabled={!newAppendixName.trim()}
                      >
                        Confirm
                      </Button>
                    </div>
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
                        className="text-[13px] h-8 cursor-pointer"
                        style={{
                          backgroundColor: "var(--color-negative)",
                          color: "var(--text-on-primary)",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
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
          </UnderlineTabsContent>

          <UnderlineTabsContent value="comments" className="m-0 border-0 outline-none flex flex-col w-full h-[400px] max-h-[50vh] data-[state=inactive]:hidden pointer-events-auto relative">
            <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
              <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>
                Discussion
              </span>
              <button
                onClick={() => setShowResolved(!showResolved)}
                className="text-[11px] font-medium hover:underline"
                style={{ color: "var(--color-brand)" }}
              >
                {showResolved ? "Hide resolved" : "Show resolved"}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
              {displayComments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-6">
                  <MessageSquare className="w-8 h-8 mb-2" style={{ color: "var(--border-strong)" }} />
                  <span className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>No comments yet</span>
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Start the conversation below</span>
                </div>
              ) : (
                displayComments.map(c => (
                  <div key={c.id} className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-2.5">
                        <Avatar className="w-6 h-6 mt-0.5">
                          <AvatarFallback className="text-[10px] font-semibold bg-[var(--bg-hover)] text-[var(--text-primary)]">
                            {c.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col flex-1">
                          <div className="flex justify-between items-baseline w-full">
                            <span className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>{c.author}</span>
                            <span className="text-[10px] whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{c.timestamp}</span>
                          </div>
                          <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{c.role}</span>

                          <div className="mt-1 flex flex-col gap-1.5">
                            <span className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                              {c.body}
                            </span>

                            <div className="flex items-center justify-between mt-0.5">
                              <button className="text-[11px] font-medium hover:underline flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                                Reply
                              </button>

                              {!c.resolved && onResolveComment && (
                                <button
                                  onClick={() => onResolveComment(data.id, c.id)}
                                  className="text-[11px] font-medium hover:underline"
                                  style={{ color: "var(--color-positive)" }}
                                >
                                  Mark as resolved
                                </button>
                              )}
                              {c.resolved && (
                                <span className="text-[11px] font-medium italic" style={{ color: "var(--text-muted)" }}>Resolved</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    {c.replies?.map(r => (
                      <div key={r.id} className="flex flex-col gap-2 ml-5 border-l-2 pl-3 mt-1" style={{ borderColor: "var(--border-subtle)" }}>
                        <div className="flex items-start gap-2.5">
                          <Avatar className="w-5 h-5 mt-0.5">
                            <AvatarFallback className="text-[9px] font-semibold bg-[var(--bg-hover)] text-[var(--text-primary)]">
                              {r.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col flex-1">
                            <div className="flex justify-between items-baseline w-full">
                              <span className="text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>{r.author}</span>
                              <span className="text-[9px] whitespace-nowrap" style={{ color: "var(--text-muted)" }}>{r.timestamp}</span>
                            </div>
                            <div className="mt-0.5">
                              <span className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                {r.body}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            <div className="p-3" style={{ borderTop: "1px solid var(--border-subtle)", backgroundColor: "var(--bg-hover)" }}>
              <div className="relative">
                <Textarea
                  value={commentText}
                  onChange={handleCommentChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a comment... (Type @ to mention)"
                  className="min-h-[60px] text-[13px] resize-none pr-10"
                  style={{ backgroundColor: "var(--bg-card)" }}
                />

                {showMentions && (
                  <div className="absolute bottom-full left-0 mb-1 w-[200px] rounded-md shadow-lg overflow-hidden py-1 z-10" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                    {mentionUsers.map(u => (
                      <button
                        key={u}
                        className="w-full text-left px-3 py-1.5 text-[12px] font-medium hover:bg-[var(--bg-hover)]"
                        style={{ color: "var(--text-primary)" }}
                        onClick={() => {
                          setCommentText(prev => prev.replace(/@\w*$/, `@${u} `));
                          setShowMentions(false);
                        }}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                )}

                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 bottom-1 h-7 w-7 rounded-sm"
                  style={{ color: commentText.trim() ? "var(--color-brand)" : "var(--text-muted)" }}
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim()}
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </UnderlineTabsContent>
        </UnderlineTabs>
      </Card>
    </div>
  );
}
