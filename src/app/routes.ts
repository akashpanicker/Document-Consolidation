import { createBrowserRouter } from "react-router";
import { LoginScreen } from "./screens/LoginScreen";
import { ScopeScreen } from "./screens/ScopeScreen";
import { ReviewScreen } from "./screens/ReviewScreen";

export const router = createBrowserRouter([
  { path: "/", Component: LoginScreen },
  { path: "/scope", Component: ScopeScreen },
  { path: "/review", Component: ReviewScreen },
]);