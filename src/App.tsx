import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import GoalsPage from "./pages/GoalsPage";
import DashboardPage from "./pages/DashboardPage";
import WeeklyLogPage from "./pages/WeeklyLogPage";
import ProgressPage from "./pages/ProgressPage";
import NotFound from "./pages/NotFound";
import AdminPanelPage from "./pages/AdminPanelPage";
import LoginPage from "./pages/LoginPage";

import { useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  const { user, loading } = useAuth();

  // While loading auth state, show login
  if (loading) {
    return <LoginPage />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/log" element={<WeeklyLogPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/admin/*" element={user?.role === "admin" ? <AdminPanelPage /> : <NotFound />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes - only for authenticated users */}
            <Route 
              path="*" 
              element={user ? (
                <NotFound />
              ) : (
                <LoginPage />
              ) 
            } 
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;