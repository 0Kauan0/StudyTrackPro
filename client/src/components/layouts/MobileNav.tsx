import React from "react";
import { Link } from "wouter";
import { Clock, BarChart2, CalendarDays, User } from "lucide-react";
import { motion } from "framer-motion";

type MobileNavProps = {
  activePath: string;
};

const MobileNav: React.FC<MobileNavProps> = ({ activePath }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-800 border-t border-slate-700 z-10 flex items-center justify-around px-4">
      <Link href="/">
        <a className="flex flex-col items-center justify-center gap-1 text-slate-400">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: activePath === 'timer' ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className={activePath === 'timer' ? 'text-primary-500' : ''}
          >
            <Clock className="h-6 w-6" />
          </motion.div>
          <span className="text-xs">Cronômetro</span>
        </a>
      </Link>
      <Link href="/metrics">
        <a className="flex flex-col items-center justify-center gap-1 text-slate-400">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: activePath === 'metrics' ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className={activePath === 'metrics' ? 'text-primary-500' : ''}
          >
            <BarChart2 className="h-6 w-6" />
          </motion.div>
          <span className="text-xs">Métricas</span>
        </a>
      </Link>
      <Link href="/calendar">
        <a className="flex flex-col items-center justify-center gap-1 text-slate-400">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: activePath === 'calendar' ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className={activePath === 'calendar' ? 'text-primary-500' : ''}
          >
            <CalendarDays className="h-6 w-6" />
          </motion.div>
          <span className="text-xs">Calendário</span>
        </a>
      </Link>
      <Link href="/profile">
        <a className="flex flex-col items-center justify-center gap-1 text-slate-400">
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: activePath === 'profile' ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className={activePath === 'profile' ? 'text-primary-500' : ''}
          >
            <User className="h-6 w-6" />
          </motion.div>
          <span className="text-xs">Perfil</span>
        </a>
      </Link>
    </nav>
  );
};

export default MobileNav;
