export interface DashboardStats {
  totalDocuments: number;
  awaitingMyReview: number;
  inProgress: number;
  completedThisMonth: number;
}

export interface ConsolidationTask {
  id: string;
  documentName: string;
  documentType: "Standard" | "Procedure" | "Checklist" | "Policy";
  reviewerPosition: number;
  totalReviewers: number;
  progressPercent: number;
  status?: "pending" | "in-progress" | "completed";
  completedAt?: string;
  completedBy?: string;
}

export interface ActivityItem {
  id: string;
  description: string;
  relativeTime: string;
  actionType: "approved" | "rejected" | "created";
}
