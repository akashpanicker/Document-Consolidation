import { createBrowserRouter } from "react-router";
import { LoginPage } from "./features/auth/LoginPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { NewConsolidationPage } from "./features/new-consolidation/NewConsolidationPage";
import { ReviewPage } from "./features/review/ReviewPage";
import { CompletedDocumentPage } from "./features/view/CompletedDocumentPage";

export const router = createBrowserRouter([
  { path: "/", Component: LoginPage },
  { path: "/dashboard", Component: DashboardPage },
  { path: "/new-consolidation", Component: NewConsolidationPage },
  { path: "/review", Component: ReviewPage },
  { path: "/document/:id/view", Component: CompletedDocumentPage },
]);
