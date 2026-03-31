import { RouterProvider } from "react-router";
import { router } from "./routes";
import { LanguageProvider } from "./components/LanguageContext";
import { ThemeProvider } from "./components/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </ThemeProvider>
  );
}