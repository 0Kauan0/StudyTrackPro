import React from "react";
import { Link } from "wouter";
import { Clock, BarChart2, CalendarDays, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useProfile } from "@/hooks/use-profile";

// Definição local do tipo Streak
interface Streak {
  id: number;
  currentStreak: number;
  lastStudyDate: string | null;
}

type SidebarProps = {
  activePath: string;
};

const Sidebar: React.FC<SidebarProps> = ({ activePath }) => {
  // Get streak data
  const { data: streak } = useQuery<Streak>({
    queryKey: ['/api/streak'],
    staleTime: 60 * 1000, // 1 minute
  });
  
  // Get user profile data
  const { profile } = useProfile();

  const currentStreak = streak?.currentStreak || 0;
  
  // Generate initials from the user's name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-800 border-r border-slate-700 p-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className="text-xl font-heading font-bold text-white">YPT Estudos</h1>
      </div>
      
      <nav className="space-y-2 flex-1">
        <Link href="/">
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg ${activePath === 'timer' ? 'bg-slate-700 text-white font-medium' : 'text-slate-300 hover:bg-slate-700/50 transition-colors'}`}>
            <Clock className="h-5 w-5" />
            <span>Cronômetro</span>
          </a>
        </Link>
        <Link href="/metrics">
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg ${activePath === 'metrics' ? 'bg-slate-700 text-white font-medium' : 'text-slate-300 hover:bg-slate-700/50 transition-colors'}`}>
            <BarChart2 className="h-5 w-5" />
            <span>Métricas</span>
          </a>
        </Link>
        <Link href="/calendar">
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg ${activePath === 'calendar' ? 'bg-slate-700 text-white font-medium' : 'text-slate-300 hover:bg-slate-700/50 transition-colors'}`}>
            <CalendarDays className="h-5 w-5" />
            <span>Calendário</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg ${activePath === 'profile' ? 'bg-slate-700 text-white font-medium' : 'text-slate-300 hover:bg-slate-700/50 transition-colors'}`}>
            <User className="h-5 w-5" />
            <span>Perfil</span>
          </a>
        </Link>
      </nav>
      
      <div className="mt-auto pt-4 border-t border-slate-700">
        <div className="px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-primary-400 font-medium">
              {profile ? getInitials(profile.name) : '--'}
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {profile ? profile.name : 'Carregando...'}
              </p>
              <p className="text-xs text-slate-400">
                Nível {profile?.level || 1} • {currentStreak > 0 ? `${currentStreak} dias consecutivos` : 'Comece hoje!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
