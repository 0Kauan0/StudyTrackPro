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
  const { profile, isLoading, updateProfile } = useProfile();

  useEffect(() => {
    // Verificar se o usuário já tem um perfil ou se deve mostrar a tela de onboarding
    if (!isLoading && profile) {
      console.log("Perfil atual:", profile); // Debug para ver o perfil carregado
      
      // Garantir que o perfil tenha o nível e XP corretos quando for novo usuário
      if (profile.name === "Novo Usuário" && (profile.level !== 1 || profile.xp !== 0)) {
        console.log("Resetando nível e XP para novo usuário");
        updateProfile({
          level: 1,
          xp: 0,
          totalStudyHours: 0
        });
      }
      
      const isNewUser = profile.name === "Novo Usuário";
      setShowOnboarding(isNewUser);
    }
  }, [profile, isLoading, updateProfile]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Forçar recarregamento dos dados do perfil após completar o onboarding
    window.location.reload();
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
