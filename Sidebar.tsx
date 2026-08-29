import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MapPin, Activity, Bot, AlertTriangle, FileText, Settings, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Sites', path: '/dashboard/sites', icon: MapPin },
    { name: 'Heat Monitor', path: '/dashboard/monitor', icon: Activity },
    { name: 'AI Agent', path: '/dashboard/agent', icon: Bot },
    { name: 'Alerts', path: '/dashboard/alerts', icon: AlertTriangle },
    { name: 'Reports', path: '/dashboard/reports', icon: FileText },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const [fgStatus, setFgStatus] = useState<{ state: number; label: string } | null>(null);

  useEffect(() => {
    fetch('/api/fortyguard/test-connection')
      .then(res => res.json())
      .then(data => {
        setFgStatus({ state: data.state, label: data.stateLabel });
      })
      .catch(() => {
        setFgStatus({ state: 3, label: 'Connection Error' });
      });
  }, []);

  const renderNav = () => (
    <>
      <div className="p-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="text-orange-500 w-6 h-6" />
          HeatShield AI
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
                ${isActive 
                  ? 'bg-slate-800 text-white shadow-sm' 
                  : 'hover:bg-slate-800/50 text-slate-300 hover:text-slate-100'}`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 m-4 bg-slate-800/80 rounded-lg border border-slate-700/80 mt-auto">
        <div className="flex items-center gap-2 mb-1.5">
          <div className={`w-2 h-2 rounded-full ${
            fgStatus?.state === 0 ? 'bg-emerald-500 animate-pulse' :
            fgStatus?.state === 4 ? 'bg-blue-400' : 'bg-amber-500'
          }`}></div>
          <span className="text-xs font-semibold text-slate-200">
            {fgStatus?.state === 0 ? 'FortyGuard Connected' :
             fgStatus?.state === 4 ? 'FortyGuard API Connected' :
             'FortyGuard Status'}
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          {fgStatus?.state === 0 ? 'Hyper-local Thermal Intelligence' :
           fgStatus?.state === 4 ? 'No Thermal Data Returned' :
           fgStatus?.label || 'Checking connection...'}
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-slate-900 text-white z-40 flex items-center justify-between px-4 border-b border-slate-800">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-sm">
          <Activity className="text-orange-500 w-5 h-5" />
          HeatShield AI
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-slate-300 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 bg-slate-900 text-slate-300 h-full flex flex-col z-10 shadow-xl border-r border-slate-800">
            {renderNav()}
          </div>
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 h-full flex-shrink-0 flex-col border-r border-slate-800 sticky top-0">
        {renderNav()}
      </aside>
    </>
  );
}
