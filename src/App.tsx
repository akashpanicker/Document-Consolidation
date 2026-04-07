import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./components/shared/ThemeContext";
import { TooltipProvider } from "./components/ui/tooltip";

export default function App() {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={300}>
        <RouterProvider router={router} />
      </TooltipProvider>
    </ThemeProvider>
  );
}