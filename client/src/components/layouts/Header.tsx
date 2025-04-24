import React from "react";
import { Bell } from "lucide-react";
import { Input } from "@/components/ui/input";

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 py-3 px-4 flex items-center justify-between">
      <div className="flex items-center md:hidden gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className="text-lg font-heading font-bold text-white">YPT Estudos</h1>
      </div>
      
      <div className="relative w-full max-w-md hidden md:block">
        <Input 
          type="text" 
          placeholder="Buscar matérias, cursos..." 
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-slate-700 border-0 text-sm text-slate-200 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary-500"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
          <Bell className="h-6 w-6" />
        </button>
        
        <div className="w-10 h-10 rounded-full bg-slate-700 md:hidden flex items-center justify-center text-primary-400 font-medium">
          JP
        </div>
      </div>
    </header>
  );
};

export default Header;
