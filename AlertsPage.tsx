import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Alert } from '../types';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'RESOLVED' | 'ALL'>('ACTIVE');

  useEffect(() => {
    fetch('/api/alerts')
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleResolve = async (id: string) => {
    try {
      const res = await fetch(`/api/alerts/${id}/resolve`, { method: 'POST' });
      if (res.ok) {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'RESOLVED', resolvedAt: Date.now() } : a));
      }
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  };

  const displayedAlerts = alerts.filter(a => {
    if (activeTab === 'ACTIVE') return a.status === 'ACTIVE';
    if (activeTab === 'RESOLVED') return a.status === 'RESOLVED';
    return true;
  });

  const activeCount = alerts.filter(a => a.status === 'ACTIVE').length;
  const resolvedCount = alerts.filter(a => a.status === 'RESOLVED').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto min-w-0 pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto p-8">
          <header className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {activeTab === 'ACTIVE' ? 'Active Alerts' : activeTab === 'RESOLVED' ? 'Resolved Alerts History' : 'All Alerts Log'}
                </h1>
                <p className="text-slate-500 mt-1">Manage automated thermal risk warnings.</p>
              </div>
            </div>

            {/* Status Tabs */}
            <div className="flex bg-slate-200/80 p-1 rounded-xl gap-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('ACTIVE')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'ACTIVE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Active</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeCount > 0 ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-600'
                }`}>{activeCount}</span>
              </button>
              <button
                onClick={() => setActiveTab('RESOLVED')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'RESOLVED' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Resolved History</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800">{resolvedCount}</span>
              </button>
            </div>
          </header>

          {loading ? (
            <div className="text-center p-8 text-slate-500">Loading alerts...</div>
          ) : displayedAlerts.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center">
              <AlertTriangle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                {activeTab === 'ACTIVE' ? 'No Active Alerts' : 'No Resolved Alerts'}
              </h2>
              <p className="text-slate-500">
                {activeTab === 'ACTIVE' 
                  ? 'All monitored sites are currently operating within safe thermal thresholds.' 
                  : 'No alerts have been resolved yet.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {displayedAlerts.map(alert => (
                <div key={alert.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className={`p-2 rounded-full ${alert.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-600' : alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                    {alert.status === 'RESOLVED' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{alert.message}</h3>
                    <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {alert.severity}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${alert.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                        {alert.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-slate-400 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.createdAt).toLocaleString()}
                    </div>
                    {alert.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                      >
                        Resolve Alert
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
