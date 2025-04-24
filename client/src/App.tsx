import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import AppLayout from "@/components/layouts/AppLayout";
import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/use-profile";
import OnboardingScreen from "@/components/onboarding/OnboardingScreen";

// Pages
import TimerPage from "@/pages/timer";
import MetricsPage from "@/pages/metrics";
import CalendarPage from "@/pages/calendar";
import ProfilePage from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={TimerPage} />
        <Route path="/metrics" component={MetricsPage} />
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function AppContent() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { profile, isLoading } = useProfile();

  useEffect(() => {
    // Verificar se o usuário já tem um perfil ou se deve mostrar a tela de onboarding
    if (!isLoading && profile) {
      const isNewUser = profile.name === "Novo Usuário";
      setShowOnboarding(isNewUser);
    }
  }, [profile, isLoading]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 dark">
      <Toaster />
      {showOnboarding ? (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      ) : null}
      <Router />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
