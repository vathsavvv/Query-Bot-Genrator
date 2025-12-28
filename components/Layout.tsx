
import React from 'react';
import { View } from '../types';
import { LayoutDashboard, Database, Settings, MessageSquare, Terminal } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
  botName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, botName }) => {
  const navItems = [
    { id: View.DASHBOARD, label: 'Control Center', icon: LayoutDashboard },
    { id: View.KNOWLEDGE_BASE, label: 'Data Input', icon: Database },
    { id: View.BOT_SETUP, label: 'Core Config', icon: Settings },
    { id: View.CHAT, label: 'Test Drive', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#E5E7EB] text-black">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-white brutalist-border md:m-4 flex flex-col">
        <div className="p-6 bg-[#000] text-white brutalist-border mb-4">
          <h1 className="text-2xl font-black italic flex items-center gap-2">
            <Terminal size={28} /> TEAM - F4
          </h1>
          <p className="text-xs mt-2 opacity-70">BRUTALIST KNOWLEDGE ENGINE v1.0.4</p>
        </div>

        <nav className="flex-1 px-4 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`
                w-full flex items-center gap-4 p-4 brutalist-border font-bold uppercase tracking-tight
                transition-all brutalist-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none
                ${currentView === item.id ? 'bg-[#FFFF00]' : 'bg-white'}
              `}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="p-4 bg-black text-white brutalist-border text-sm">
            <p className="opacity-50 text-[10px] uppercase font-bold">Current Node:</p>
            <p className="font-mono truncate">{botName || "NOT_INITIALIZED"}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
