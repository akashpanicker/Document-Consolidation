import { createBrowserRouter } from "react-router";
import { LoginScreen } from "./screens/LoginScreen";
import { DashboardPage } from "./pages/DashboardPage";
import { ScopePage } from "./pages/ScopePage";
import { ReviewScreen } from "./screens/ReviewScreen";

export const router = createBrowserRouter([
  { path: "/", Component: LoginScreen },
  { path: "/dashboard", Component: DashboardPage },
  { path: "/scope", Component: ScopePage },
  { path: "/review", Component: ReviewScreen },
]);