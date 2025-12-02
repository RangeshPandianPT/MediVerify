import React from "react";
import Routes from "./Routes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ToastProvider } from "./components/ui/Toast";
import OfflineIndicator from "./components/ui/OfflineIndicator";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
          <OfflineIndicator />
          <Routes />
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
