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

const MY_TASKS: ConsolidationTask[] = [
  {
    id: "task-1",
    documentName: "Well Control Manual — MENA Region",
    documentType: "Standard",
    reviewerPosition: 1,
    totalReviewers: 3,
    progressPercent: 33,
  },
  {
    id: "task-2",
    documentName: "HSE Emergency Response Procedure",
    documentType: "Procedure",
    reviewerPosition: 2,
    totalReviewers: 3,
    progressPercent: 67,
  },
  {
    id: "task-3",
    documentName: "Rig Floor Safety Checklist — Offshore",
    documentType: "Checklist",
    reviewerPosition: 1,
    totalReviewers: 2,
    progressPercent: 50,
  },
  {
    id: "task-4",
    documentName: "Environmental Management System Policy",
    documentType: "Policy",
    reviewerPosition: 3,
    totalReviewers: 4,
    progressPercent: 75,
  },
  {
    id: "task-5",
    documentName: "H2S Safety & Hydrogen Sulphide Standard",
    documentType: "Standard",
    reviewerPosition: 2,
    totalReviewers: 2,
    progressPercent: 90,
  },
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

  const handleCreateNew = () => navigate("/scope");
  const handleReview = (_id: string) => navigate("/review");

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-page)", fontFamily: "Inter, sans-serif" }}
    >
      <Header breadcrumb="Dashboard" showOnlineStatus={true} showUser={true} />

      <main className="flex-1 w-full px-[24px] flex flex-col pb-6 mt-2 overflow-y-auto">
        {/* Page title row */}
        <div className="flex items-center justify-between mt-6 mb-6">
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
              color: "#FFFFFF",
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
          />
          <StatCard
            label="Completed"
            value={STATS.completedThisMonth}
            supportingText="Approved and published"
            valueColor="var(--color-success)"
          />
        </div>

        {/* Row 2 — Task list + Activity feed */}
        <div className="grid gap-5 flex-1 min-h-0" style={{ gridTemplateColumns: "3fr 2fr" }}>
          {/* My Review Queue */}
          <ReviewQueue tasks={MY_TASKS} onReview={handleReview} />

          {/* Recent Activity */}
          <ActivityFeed items={ACTIVITY_FEED} />
        </div>
      </main>
    </div>
  );
}

/* ── Review Queue Section ───────────────────────────────────── */

function ReviewQueue({
  tasks,
  onReview,
}: {
  tasks: ConsolidationTask[];
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
      {/* Section header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
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
          My Review Queue
        </span>
        <button
          type="button"
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
