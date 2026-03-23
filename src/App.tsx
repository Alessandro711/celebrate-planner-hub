import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { subscribeToSettings } from "@/lib/storage";
import { applyPalette, applyCustomColors } from "@/lib/palettes";
import Dashboard from "./pages/Dashboard";
import Guests from "./pages/Guests";
import WeddingParty from "./pages/WeddingParty";
import Budget from "./pages/Budget";
import Vendors from "./pages/Vendors";
import Checklist from "./pages/Checklist";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function PaletteLoader() {
  useEffect(() => {
    const unsub = subscribeToSettings((s) => {
      if (s.colorPalette === 'custom' && s.customColors) {
        applyCustomColors(s.customColors.primary, s.customColors.secondary, s.customColors.accent);
      } else if (s.colorPalette) {
        applyPalette(s.colorPalette);
      }
    });
    return () => unsub();
  }, []);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PaletteLoader />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/guests" element={<ProtectedRoute><Guests /></ProtectedRoute>} />
          <Route path="/wedding-party" element={<ProtectedRoute><WeddingParty /></ProtectedRoute>} />
          <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
          <Route path="/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
          <Route path="/checklist" element={<ProtectedRoute><Checklist /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
