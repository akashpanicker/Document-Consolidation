import { createBrowserRouter } from "react-router";
import { LoginPage } from "./features/auth/LoginPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { ScopePage } from "./features/scope/ScopePage";
import { ReviewPage } from "./features/review/ReviewPage";
import { CompletedDocumentPage } from "./features/view/CompletedDocumentPage";

export const router = createBrowserRouter([
  { path: "/", Component: LoginPage },
  { path: "/dashboard", Component: DashboardPage },
  { path: "/scope", Component: ScopePage },
  { path: "/review", Component: ReviewPage },
  { path: "/document/:id/view", Component: CompletedDocumentPage },
]);
