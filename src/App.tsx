import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes - only for authenticated users */}
            <Route 
              path="/goals" 
              element={user ? <GoalsPage /> : <Navigate to="/" replace />}
            />
            <Route 
              path="/dashboard" 
              element={user ? <DashboardPage /> : <Navigate to="/" replace />}
            />
            <Route 
              path="/log" 
              element={user ? <WeeklyLogPage /> : <Navigate to="/" replace />}
            />
            <Route 
              path="/progress" 
              element={user ? <ProgressPage /> : <Navigate to="/" replace />}
            />
            <Route 
              path="/admin/*" 
              element={user?.role === "admin" ? <AdminPanelPage /> : <Navigate to="/" replace />}
            />
            
            {/* Catch-all for any other routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;