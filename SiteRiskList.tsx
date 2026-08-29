import { useEffect, useState } from 'react';
import { SiteAnalysis } from '../types';
import { AlertTriangle, ThermometerSun, MapPin, Activity } from 'lucide-react';

export default function SiteRiskList() {
  const [data, setData] = useState<SiteAnalysis[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/agent/analysis')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-slate-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
        <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">No Monitored Worksites</h3>
        <p className="text-slate-500">Add a site in the settings to begin monitoring heat risk.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">Current Site Risk Ranking</h2>
        <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded">Live FortyGuard Data</span>
      </div>
      <div className="divide-y divide-slate-100">
        {data.map((analysis, index) => {
          const riskColor = 
            analysis.risk?.level === 'Critical' ? 'text-red-600 bg-red-50' :
            analysis.risk?.level === 'High' ? 'text-orange-600 bg-orange-50' :
            analysis.risk?.level === 'Moderate' ? 'text-yellow-600 bg-yellow-50' :
            'text-green-600 bg-green-50';
            
          return (
            <div key={analysis.site.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{analysis.site.name}</h3>
                    <p className="text-sm text-slate-500">{analysis.site.city}, {analysis.site.state}</p>
                  </div>
                </div>
                {analysis.risk ? (
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${riskColor}`}>
                    {analysis.risk.level} ({analysis.risk.score})
                  </div>
                ) : (
                  <div className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                    Data Unavailable
                  </div>
                )}
              </div>

              {analysis.temperature ? (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3 border border-slate-100">
                    <ThermometerSun className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Daily Peak (Forecast)</p>
                      <p className="text-lg font-bold text-slate-900">{analysis.temperature.max.toFixed(1)}°C</p>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3 border border-slate-100">
                    <Activity className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Daily Average</p>
                      <p className="text-lg font-bold text-slate-900">{analysis.temperature.current.toFixed(1)}°C</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  {analysis.error}
                </div>
              )}

              {analysis.risk && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-700"><strong>Recommendation:</strong> {analysis.risk.recommendation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
