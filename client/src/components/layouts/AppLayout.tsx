import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNav from "./MobileNav";
import { useLocation } from "wouter";

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [location] = useLocation();
  
  // Determine active route for mobile navigation
  const activePath = location === "/" 
    ? "timer" 
    : location.startsWith("/metrics") 
      ? "metrics" 
      : location.startsWith("/calendar") 
        ? "calendar" 
        : location.startsWith("/profile") 
          ? "profile" 
          : "";

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar - desktop only */}
      <Sidebar activePath={activePath} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide pb-20 md:pb-6">
          {children}
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav activePath={activePath} />
    </div>
  );
};

export default AppLayout;
