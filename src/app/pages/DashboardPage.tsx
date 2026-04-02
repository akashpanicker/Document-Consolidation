import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { FolderSearch } from "lucide-react";
import { Header } from "../components/Header";
import { StatCard } from "../components/dashboard/StatCard";
import { TaskRow } from "../components/dashboard/TaskRow";
import { ActivityItem } from "../components/dashboard/ActivityItem";
import { DashboardStats, ConsolidationTask, ActivityItem as ActivityItemType } from "../types/dashboard.types";

/* ── Mock Data ─────────────────────────────────────────────── */

const STATS: DashboardStats = {
  totalDocuments: 2548,
  awaitingMyReview: 5,
  inProgress: 12,
  completedThisMonth: 7,
};

const TASK_LIST: ConsolidationTask[] = [
  // My Review Queue (Current user tasks) - 5 items
  {
    id: "task-1",
    documentName: "Well Control Manual — MENA Region",
    documentType: "Standard",
    reviewerPosition: 1,
    totalReviewers: 3,
    progressPercent: 33,
    status: "pending",
  },
  {
    id: "task-2",
    documentName: "HSE Emergency Response Procedure",
    documentType: "Procedure",
    reviewerPosition: 2,
    totalReviewers: 3,
    progressPercent: 67,
    status: "pending",
  },
  {
    id: "task-3",
    documentName: "Rig Floor Safety Checklist — Offshore",
    documentType: "Checklist",
    reviewerPosition: 1,
    totalReviewers: 2,
    progressPercent: 50,
    status: "pending",
  },
  {
    id: "task-4",
    documentName: "Environmental Management System Policy",
    documentType: "Policy",
    reviewerPosition: 3,
    totalReviewers: 4,
    progressPercent: 75,
    status: "pending",
  },
  {
    id: "task-5",
    documentName: "H2S Safety & Hydrogen Sulphide Standard",
    documentType: "Standard",
    reviewerPosition: 2,
    totalReviewers: 2,
    progressPercent: 90,
    status: "pending",
  },

  // In Progress (Completed by 1st or 2nd, but not last) - 12 items
  {
    id: "task-6",
    documentName: "Offshore Drilling Guidelines",
    documentType: "Standard",
    reviewerPosition: 1,
    totalReviewers: 3,
    progressPercent: 33,
    status: "in-progress",
    completedAt: "2026-04-01 10:30 AM",
    completedBy: "Sarah Chen",
  },
  {
    id: "task-7",
    documentName: "Spill Prevention Plan",
    documentType: "Policy",
    reviewerPosition: 2,
    totalReviewers: 3,
    progressPercent: 66,
    status: "in-progress",
    completedAt: "2026-04-01 02:15 PM",
    completedBy: "James Okonkwo",
  },
  { id: "task-ip-3", documentName: "Blowout Preventer Inspection", documentType: "Procedure", reviewerPosition: 1, totalReviewers: 3, progressPercent: 33, status: "in-progress", completedAt: "2026-03-29 11:20 AM", completedBy: "Wei Zhang" },
  { id: "task-ip-4", documentName: "Mooring System Standards", documentType: "Standard", reviewerPosition: 1, totalReviewers: 2, progressPercent: 50, status: "in-progress", completedAt: "2026-03-28 09:45 AM", completedBy: "Lisa Park" },
  { id: "task-ip-5", documentName: "Waste Management Protocol", documentType: "Policy", reviewerPosition: 2, totalReviewers: 4, progressPercent: 50, status: "in-progress", completedAt: "2026-03-28 01:10 PM", completedBy: "Ahmed Al-Rashid" },
  { id: "task-ip-6", documentName: "Confined Space Entry", documentType: "Procedure", reviewerPosition: 1, totalReviewers: 3, progressPercent: 33, status: "in-progress", completedAt: "2026-03-27 10:00 AM", completedBy: "Carlos Rivera" },
  { id: "task-ip-7", documentName: "Lifting Operations Guide", documentType: "Standard", reviewerPosition: 1, totalReviewers: 2, progressPercent: 50, status: "in-progress", completedAt: "2026-03-26 03:30 PM", completedBy: "Sarah Chen" },
  { id: "task-ip-8", documentName: "Radiographic Testing Manual", documentType: "Procedure", reviewerPosition: 2, totalReviewers: 3, progressPercent: 66, status: "in-progress", completedAt: "2026-03-26 11:15 AM", completedBy: "James Okonkwo" },
  { id: "task-ip-9", documentName: "Contractor Safety Plan", documentType: "Policy", reviewerPosition: 1, totalReviewers: 3, progressPercent: 33, status: "in-progress", completedAt: "2026-03-25 02:20 PM", completedBy: "Marcos Diaz" },
  { id: "task-ip-10", documentName: "Equipment Maintenance Schedule", documentType: "Standard", reviewerPosition: 2, totalReviewers: 4, progressPercent: 50, status: "in-progress", completedAt: "2026-03-25 09:10 AM", completedBy: "Wei Zhang" },
  { id: "task-ip-11", documentName: "Fire Protection Standard", documentType: "Standard", reviewerPosition: 1, totalReviewers: 3, progressPercent: 33, status: "in-progress", completedAt: "2026-03-24 04:50 PM", completedBy: "Lisa Park" },
  { id: "task-ip-12", documentName: "Hazardous Materials Handling", documentType: "Procedure", reviewerPosition: 2, totalReviewers: 3, progressPercent: 66, status: "in-progress", completedAt: "2026-03-24 10:30 AM", completedBy: "Ahmed Al-Rashid" },

  // Completed (Completed by the last reviewer) - 7 items
  {
    id: "task-8",
    documentName: "Safety Management System",
    documentType: "Standard",
    reviewerPosition: 3,
    totalReviewers: 3,
    progressPercent: 100,
    status: "completed",
    completedAt: "2026-03-30 09:00 AM",
    completedBy: "Marcos Diaz",
  },
  {
    id: "task-9",
    documentName: "Personnel Transport Standard",
    documentType: "Standard",
    reviewerPosition: 2,
    totalReviewers: 2,
    progressPercent: 100,
    status: "completed",
    completedAt: "2026-03-29 04:45 PM",
    completedBy: "Wei Zhang",
  },
  { id: "task-c-3", documentName: "Emergency Evacuation Plan", documentType: "Procedure", reviewerPosition: 3, totalReviewers: 3, progressPercent: 100, status: "completed", completedAt: "2026-03-28 11:30 AM", completedBy: "Sarah Chen" },
  { id: "task-c-4", documentName: "Work Permit Policy", documentType: "Policy", reviewerPosition: 2, totalReviewers: 2, progressPercent: 100, status: "completed", completedAt: "2026-03-27 02:20 PM", completedBy: "James Okonkwo" },
  { id: "task-c-5", documentName: "Pipe Handling Manual", documentType: "Standard", reviewerPosition: 3, totalReviewers: 3, progressPercent: 100, status: "completed", completedAt: "2026-03-26 09:15 AM", completedBy: "Lisa Park" },
  { id: "task-c-6", documentName: "Hearing Conservation Program", documentType: "Policy", reviewerPosition: 4, totalReviewers: 4, progressPercent: 100, status: "completed", completedAt: "2026-03-25 03:40 PM", completedBy: "Ahmed Al-Rashid" },
  { id: "task-c-7", documentName: "First Aid & Medical Protocol", documentType: "Procedure", reviewerPosition: 3, totalReviewers: 3, progressPercent: 100, status: "completed", completedAt: "2026-03-24 11:10 AM", completedBy: "Carlos Rivera" },
];

const ACTIVITY_FEED: ActivityItemType[] = [
  {
    id: "act-1",
    description: "Marcos Diaz approved 3 chunks in Well Control Manual",
    relativeTime: "5 minutes ago",
    actionType: "approved",
  },
  {
    id: "act-2",
    description: "Sarah Chen created a new consolidation for Drilling Operations Standard",
    relativeTime: "32 minutes ago",
    actionType: "created",
  },
  {
    id: "act-3",
    description: "James Okonkwo approved 5 chunks in Environmental Management Policy",
    relativeTime: "1 hour ago",
    actionType: "approved",
  },
  {
    id: "act-4",
    description: "Lisa Park rejected 2 chunks in H2S Safety Standard",
    relativeTime: "2 hours ago",
    actionType: "rejected",
  },
  {
    id: "act-5",
    description: "Marcos Diaz approved 7 chunks in LOTO Procedure",
    relativeTime: "4 hours ago",
    actionType: "approved",
  },
  {
    id: "act-6",
    description: "Ahmed Al-Rashid created a new consolidation for Rig Move Standard",
    relativeTime: "6 hours ago",
    actionType: "created",
  },
  {
    id: "act-7",
    description: "Wei Zhang approved 4 chunks in Emergency Response Checklist",
    relativeTime: "Yesterday",
    actionType: "approved",
  },
  {
    id: "act-8",
    description: "Carlos Rivera rejected 1 chunk in Permit to Work Standard",
    relativeTime: "2 days ago",
    actionType: "rejected",
  },
];

/* ── Component ─────────────────────────────────────────────── */

export function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"pending" | "in-progress" | "completed">("pending");

  const handleCreateNew = () => navigate("/scope");
  const handleReview = (_id: string) => navigate("/review");

  const filteredTasks = useMemo(() => {
    return TASK_LIST.filter(task => task.status === activeTab);
  }, [activeTab]);

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-page)", fontFamily: "Inter, sans-serif" }}
    >
      <Header breadcrumb="Dashboard" showOnlineStatus={true} showUser={true} />

      <main className="flex-1 w-full px-[24px] flex flex-col pb-6 mt-2 overflow-y-auto">
        {/* Page title row */}
        <div className="flex items-center justify-between mt-6 mb-3">
          <h1
            className="text-[20px] font-bold uppercase tracking-wide"
            style={{ color: "var(--text-primary)" }}
          >
            Dashboard
          </h1>
          <button
            type="button"
            onClick={handleCreateNew}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "Inter, sans-serif",
              padding: "8px 16px",
              borderRadius: 6,
              backgroundColor: "var(--color-brand)",
              border: "none",
              color: "var(--text-on-primary)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-brand-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-brand)";
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
            Create New Document Consolidation
          </button>
        </div>

        {/* Row 1 — Stat cards */}
        <div className="grid grid-cols-4 gap-5 mb-6">
          <StatCard
            label="Total Documents"
            value={STATS.totalDocuments}
            supportingText="Across H&P and KCAD libraries"
          />
          <StatCard
            label="Awaiting My Review"
            value={STATS.awaitingMyReview}
            supportingText="Documents in your review queue"
            valueColor="var(--color-warning)"
          />
          <StatCard
            label="In Progress"
            value={STATS.inProgress}
            supportingText="Consolidations under review"
            valueColor="var(--color-brand)"
          />
          <StatCard
            label="Completed"
            value={STATS.completedThisMonth}
            supportingText="Approved and published"
            valueColor="var(--color-success)"
          />
        </div>

        {/* Row 2 — Task list + Activity feed */}
        <div className="grid grid-cols-4 gap-5 flex-1 min-h-0">
          {/* My Review Queue */}
          <div className="col-span-3 flex flex-col min-h-0">
            <ReviewQueue
              tasks={filteredTasks}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onReview={handleReview}
            />
          </div>

          {/* Recent Activity */}
          <div className="col-span-1 flex flex-col min-h-0">
            <ActivityFeed items={ACTIVITY_FEED} />
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Review Queue Section ───────────────────────────────────── */

function ReviewQueue({
  tasks,
  activeTab,
  onTabChange,
  onReview,
}: {
  tasks: ConsolidationTask[];
  activeTab: "pending" | "in-progress" | "completed";
  onTabChange: (tab: "pending" | "in-progress" | "completed") => void;
  onReview: (id: string) => void;
}) {
  return (
    <div
      className="flex flex-col rounded-[8px] overflow-hidden"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "var(--border-default)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Tabbed Header */}
      <div
        className="flex items-center justify-between px-1 shrink-0"
        style={{ borderBottom: "var(--border-default)" }}
      >
        <div className="flex">
          {[
            { id: "pending", label: "My Review Queue" },
            { id: "in-progress", label: "In Progress" },
            { id: "completed", label: "Completed" },
          ].map((tab, idx) => {
            const isTabActive = activeTab === tab.id;
            return (
              <div key={tab.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => onTabChange(tab.id as any)}
                  className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider relative transition-colors duration-200"
                  style={{
                    color: isTabActive ? "var(--color-brand)" : "var(--text-muted)",
                    fontFamily: "Inter, sans-serif",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  {tab.label}
                  {isTabActive && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{ backgroundColor: "var(--color-brand)" }}
                    />
                  )}
                </button>
                {/* Vertical separator between tabs */}
                {idx < 2 && (
                  <div 
                    className="h-4 w-[1px]" 
                    style={{ backgroundColor: "var(--border-default)" }} 
                  />
                )}
              </div>
            );
          })}
        </div>
        
        <button
          type="button"
          className="mr-4"
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--color-brand)",
            fontFamily: "Inter, sans-serif",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          View All
        </button>
      </div>

      {/* Rows or empty state */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 px-6 flex-1">
            <FolderSearch
              className="w-[28px] h-[28px]"
              style={{ color: "var(--text-muted)", opacity: 0.4 }}
            />
            <p
              className="text-[13px] text-center"
              style={{ color: "var(--text-muted)", fontFamily: "Inter, sans-serif" }}
            >
              You have no documents pending review.
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskRow key={task.id} task={task} onReview={onReview} />
          ))
        )}
      </div>
    </div>
  );
}

/* ── Activity Feed Section ──────────────────────────────────── */

function ActivityFeed({ items }: { items: ActivityItemType[] }) {
  return (
    <div
      className="flex flex-col rounded-[8px] overflow-hidden"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "var(--border-default)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Section header */}
      <div
        className="flex items-center px-4 py-3 shrink-0"
        style={{ borderBottom: "var(--border-default)" }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase" as const,
            color: "var(--text-muted)",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Recent Activity
        </span>
      </div>

      {/* Items */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {items.map((item) => (
          <ActivityItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
