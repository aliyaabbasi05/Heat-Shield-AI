import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { 
  Activity, 
  RefreshCw, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  Sun, 
  Building2,
  TrendingUp,
  SlidersHorizontal,
  Filter,
  Trash2,
  Search,
  Plus,
  Compass
} from 'lucide-react';
import { SiteAnalysis } from '../types';

export default function MonitorPage() {
  const [analyses, setAnalyses] = useState<SiteAnalysis[]>([]);
  const [loadingTemp, setLoadingTemp] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [isOperationalRiskOpen, setIsOperationalRiskOpen] = useState(false);
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(0); // 0 = off

  // Delete site confirmation modal state
  const [siteToDelete, setSiteToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Direct fast load: retrieve FortyGuard thermal intelligence & site list in a single call
  useEffect(() => {
    fetchFortyGuardAnalysis(false);
  }, []);

  // Auto refresh timer
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;
    const timer = setInterval(() => {
      fetchFortyGuardAnalysis(true);
    }, autoRefreshInterval * 60 * 1000);
    return () => clearInterval(timer);
  }, [autoRefreshInterval]);

  const fetchFortyGuardAnalysis = async (forceRefresh = false) => {
    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setLoadingTemp(true);
    }
    setError(null);

    try {
      const url = forceRefresh ? '/api/agent/analysis?refresh=true' : '/api/agent/analysis';
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      if (Array.isArray(data)) {
        setAnalyses(data);
        setLastUpdated(new Date());
        if (data.length > 0 && (!selectedSiteId || !data.some(d => d.site.id === selectedSiteId))) {
          setSelectedSiteId(data[0].site.id);
        }
      }
    } catch (err: any) {
      console.error('Heat Monitor FortyGuard fetch error:', err);
      setError(err.message || 'Failed to retrieve FortyGuard temperature intelligence');
    } finally {
      setLoadingTemp(false);
      setIsRefreshing(false);
    }
  };

  const handlePromptDelete = (e: React.MouseEvent, siteId: string, siteName: string) => {
    e.stopPropagation();
    setSiteToDelete({ id: siteId, name: siteName });
  };

  const confirmDeleteSite = async () => {
    if (!siteToDelete) return;
    const targetId = siteToDelete.id;
    const targetName = siteToDelete.name;
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/sites/${targetId}`, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to delete site from database');
      }

      // 1. Immediately filter out deleted site from state
      const remainingAnalyses = analyses.filter(a => a.site.id !== targetId);
      setAnalyses(remainingAnalyses);

      // 2. Manage selection state cleanly
      if (selectedSiteId === targetId) {
        if (remainingAnalyses.length > 0) {
          setSelectedSiteId(remainingAnalyses[0].site.id);
        } else {
          setSelectedSiteId(null);
          setIsOperationalRiskOpen(false);
        }
      }

      // 3. Show confirmation feedback
      setSiteToDelete(null);
      setSuccessMessage(`✓ Monitored site "${targetName}" removed permanently.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Delete site error:', err);
      setError(err.message || 'Failed to remove site.');
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedAnalysis = useMemo(() => {
    if (!selectedSiteId) return analyses[0] || null;
    return analyses.find(a => a.site.id === selectedSiteId) || analyses[0] || null;
  }, [analyses, selectedSiteId]);

  const filteredAnalyses = useMemo(() => {
    return analyses.filter(a => {
      const matchesRisk = riskFilter === 'all' || a.risk?.level?.toLowerCase() === riskFilter.toLowerCase();
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        a.site.name.toLowerCase().includes(query) ||
        a.site.city.toLowerCase().includes(query) ||
        a.site.state.toLowerCase().includes(query);
      return matchesRisk && matchesSearch;
    });
  }, [analyses, riskFilter, searchQuery]);

  // Derived Summary Metrics
  const totalSites = analyses.length;
  const highRiskCount = analyses.filter(a => a.risk?.level === 'High').length;
  const criticalRiskCount = analyses.filter(a => a.risk?.level === 'Critical').length;
  
  // Highest temp site for peak window context
  const highestRiskSite = analyses[0];
  const peakWindowText = highestRiskSite?.temperature?.max 
    ? `12:00 PM – 4:00 PM (${highestRiskSite.temperature.max.toFixed(1)}°C Peak)`
    : 'Mid-day Peak (12 PM - 4 PM)';

  const handleSelectSite = (siteId: string, openDrawer = true) => {
    setSelectedSiteId(siteId);
    if (openDrawer) {
      setIsOperationalRiskOpen(true);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* 1. SIDEBAR (Fixed / Stationary) */}
      <Sidebar />

      {/* 2. MAIN CONTENT (Independently Scrollable) */}
      <main className="flex-1 h-full overflow-y-auto min-w-0 pt-14 md:pt-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
          
          {/* HEADER */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Heat Monitor</h1>
                <p className="text-slate-500 text-sm mt-0.5">
                  Live street-level thermal intelligence across your monitored worksites.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Operational Risk Panel Trigger Control */}
              <button
                type="button"
                onClick={() => setIsOperationalRiskOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-orange-600" />
                <span>Operational Risk</span>
              </button>

              {/* Auto refresh dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Auto:</span>
                <select 
                  value={autoRefreshInterval} 
                  onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
                  className="bg-transparent font-medium text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value={0}>Off</option>
                  <option value={5}>Every 5m</option>
                  <option value={10}>Every 10m</option>
                </select>
              </div>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={() => fetchFortyGuardAnalysis(true)}
                disabled={isRefreshing || loadingTemp}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing FortyGuard...' : 'Refresh Data'}
              </button>

              {lastUpdated && (
                <div className="text-right text-xs text-slate-500 font-mono hidden sm:block">
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Last Sync</span>
                  {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              )}
            </div>
          </header>

          {/* Success Banner */}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl flex items-center justify-between text-xs font-semibold animate-fade-in shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
              <button onClick={() => setSuccessMessage(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-3 text-sm">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">FortyGuard Connection Notice</h3>
                <p className="text-xs text-red-700 mt-0.5">{error}</p>
              </div>
              <button onClick={() => fetchFortyGuardAnalysis(true)} className="text-xs font-semibold underline text-red-800 hover:text-red-900">
                Retry
              </button>
            </div>
          )}

          {/* ACTIVE SITES SEARCH BAR & FILTER PANEL */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search active worksites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs text-slate-500 font-medium">
                Active Sites ({filteredAnalyses.length} of {totalSites})
              </span>
              <Link
                to="/dashboard/sites"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Site</span>
              </Link>
            </div>
          </div>

          {/* TOP SUMMARY CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Sites */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Sites</p>
                <p className="text-2xl font-bold text-slate-900">{totalSites}</p>
              </div>
            </div>

            {/* High Risk */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">High Risk</p>
                <p className="text-2xl font-bold text-amber-600">{loadingTemp ? '...' : highRiskCount}</p>
              </div>
            </div>

            {/* Critical Risk */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Critical Risk</p>
                <p className="text-2xl font-bold text-red-600">{loadingTemp ? '...' : criticalRiskCount}</p>
              </div>
            </div>

            {/* Next Peak Window */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Next Peak Window</p>
                <p className="text-xs font-bold text-slate-900 mt-1 truncate">{loadingTemp ? '...' : peakWindowText}</p>
              </div>
            </div>
          </div>

          {/* EMPTY STATE IF 0 SITES */}
          {analyses.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto my-8">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto border border-orange-100">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Active Monitored Worksites</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add a physical worksite location to begin tracking street-level microclimate heat risks with FortyGuard thermal intelligence.
              </p>
              <Link
                to="/dashboard/sites"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-orange-500/20"
              >
                <Plus className="w-4 h-4" />
                Add Monitored Worksite
              </Link>
            </div>
          ) : (
            <>
              {/* MAIN SECTION: HEAT MAP (LEFT) & LIVE RANKING (RIGHT) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT / LARGE AREA: SITE HEAT MAP */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-slate-200/80 flex items-center justify-between gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-orange-500" />
                      <h2 className="font-bold text-slate-900 text-sm">Site Heat Map</h2>
                      <span className="text-xs text-slate-400 font-normal">Real FortyGuard Coordinates</span>
                    </div>
                    
                    {/* Risk Filter */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Filter className="w-3.5 h-3.5" />
                      <select
                        value={riskFilter}
                        onChange={(e) => setRiskFilter(e.target.value)}
                        className="bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-800 text-xs font-medium focus:outline-none cursor-pointer"
                      >
                        <option value="all">All Risks</option>
                        <option value="critical">Critical Only</option>
                        <option value="high">High Only</option>
                        <option value="moderate">Moderate</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>

                  {/* Map Stage Container */}
                  <div className="relative flex-1 min-h-[360px] bg-slate-950 p-6 flex flex-col justify-between overflow-hidden">
                    {/* Map Grid / Topographic Graphic Canvas Layer */}
                    <div 
                      className="absolute inset-0 opacity-20 pointer-events-none" 
                      style={{
                        backgroundImage: `radial-gradient(#f97316 1px, transparent 1px), radial-gradient(#64748b 1px, transparent 1px)`,
                        backgroundSize: `40px 40px`,
                        backgroundPosition: `0 0, 20px 20px`
                      }} 
                    />

                    {/* Map Header Status */}
                    <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 backdrop-blur-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        <span>FORTYGUARD POLYGON AOI SCANNER</span>
                      </div>
                      <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-[10px]">
                        METRIC: FORTYGUARD HEATMAP DATA
                      </div>
                    </div>

                    {/* Site Markers Stage */}
                    <div className="relative z-10 my-auto py-8">
                      {filteredAnalyses.length === 0 ? (
                        <div className="text-center text-slate-400 py-12">
                          <p className="text-sm">No site markers match the selected search/filter criteria.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                          {filteredAnalyses.map((item) => {
                            const isSelected = selectedSiteId === item.site.id;
                            const score = item.risk?.score ?? 0;
                            const level = item.risk?.level ?? (item.temperature ? 'Low' : 'Pending');
                            const currentTemp = item.temperature?.current;

                            let colorStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
                            let badgeBg = 'bg-emerald-500 text-slate-950';

                            if (level === 'Critical') {
                              colorStyle = 'bg-red-500/20 border-red-500 text-red-300 shadow-lg shadow-red-500/20';
                              badgeBg = 'bg-red-500 text-white';
                            } else if (level === 'High') {
                              colorStyle = 'bg-orange-500/20 border-orange-500 text-orange-300';
                              badgeBg = 'bg-orange-500 text-white';
                            } else if (level === 'Moderate') {
                              colorStyle = 'bg-amber-500/20 border-amber-500 text-amber-300';
                              badgeBg = 'bg-amber-500 text-slate-950';
                            } else if (item.error || !item.temperature) {
                              colorStyle = 'bg-slate-800/80 border-slate-700 text-slate-300';
                              badgeBg = 'bg-slate-700 text-slate-300';
                            }

                            return (
                              <div
                                key={item.site.id}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    handleSelectSite(item.site.id, true);
                                  }
                                }}
                                onClick={() => handleSelectSite(item.site.id, true)}
                                className={`p-4 rounded-xl border text-left transition-all cursor-pointer backdrop-blur-md relative overflow-hidden group ${colorStyle} ${
                                  isSelected ? 'ring-2 ring-white scale-[1.02] shadow-xl' : 'hover:scale-[1.01]'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-white text-sm group-hover:text-orange-300 transition-colors truncate">
                                      {item.site.name}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                                      {item.site.city}, {item.site.state}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono ${badgeBg}`}>
                                      {item.risk ? `${score} Risk` : 'Pending'}
                                    </span>
                                    {/* DELETE SITE BIN ICON */}
                                    <button
                                      type="button"
                                      onClick={(e) => handlePromptDelete(e, item.site.id, item.site.name)}
                                      className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-800/80 rounded transition-colors"
                                      title="Remove Monitored Worksite"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                                  <span className="text-slate-300 font-mono">
                                    {loadingTemp ? (
                                      <span className="animate-pulse text-orange-400">Loading...</span>
                                    ) : currentTemp !== undefined ? (
                                      `${currentTemp.toFixed(1)}°C`
                                    ) : (
                                      'FortyGuard data unavailable'
                                    )}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {item.site.lat.toFixed(3)}, {item.site.lng.toFixed(3)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Map Legend */}
                    <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Critical (85+)</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> High (60+)</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Moderate (30+)</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Low</span>
                      </div>
                      <div className="text-slate-500 text-[10px]">
                        Data Source: FortyGuard Temperature Intelligence
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT AREA: LIVE SITE RANKING & ACTIVE SITES LIST */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                      <h2 className="font-bold text-slate-900 text-sm">Active Sites & Ranking</h2>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Sorted by Risk Score</span>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[440px]">
                    {filteredAnalyses.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-xs">
                        No sites match the current search or filter criteria.
                      </div>
                    ) : (
                      filteredAnalyses.map((item, index) => {
                        const isSelected = selectedSiteId === item.site.id;
                        const rank = index + 1;
                        const score = item.risk?.score ?? 0;
                        const level = item.risk?.level ?? 'Pending';
                        const tempC = item.temperature?.current;
                        const tempF = tempC !== undefined ? (tempC * 9 / 5 + 32) : null;

                        let badgeColor = 'bg-slate-100 text-slate-700';
                        if (level === 'Critical') badgeColor = 'bg-red-100 text-red-800 border-red-200';
                        else if (level === 'High') badgeColor = 'bg-orange-100 text-orange-800 border-orange-200';
                        else if (level === 'Moderate') badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
                        else if (level === 'Low') badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';

                        return (
                          <div
                            key={item.site.id}
                            onClick={() => handleSelectSite(item.site.id, true)}
                            className={`p-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer group ${
                              isSelected ? 'bg-orange-50/60 border-l-4 border-l-orange-500' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                rank === 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {rank}
                              </span>
                              <div className="min-w-0">
                                <h3 className="font-semibold text-slate-900 text-sm truncate">{item.site.name}</h3>
                                <p className="text-xs text-slate-500 truncate">{item.site.city}, {item.site.state}</p>
                              </div>
                            </div>

                            <div className="text-right flex items-center gap-2.5 shrink-0">
                              <div>
                                <p className="text-sm font-bold text-slate-900">
                                  {loadingTemp ? (
                                    <span className="animate-pulse text-xs text-orange-500">Loading...</span>
                                  ) : tempC !== undefined ? (
                                    `${tempC.toFixed(1)}°C`
                                  ) : (
                                    'Unavailable'
                                  )}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono">
                                  {tempF !== null ? `${tempF.toFixed(1)}°F` : ''}
                                </p>
                              </div>
                              
                              <span className={`text-xs font-bold px-2 py-1 rounded-md border ${badgeColor}`}>
                                {item.risk ? `${score} • ${level}` : 'Pending'}
                              </span>

                              {/* BIN / DELETE ICON BUTTON */}
                              <button
                                type="button"
                                onClick={(e) => handlePromptDelete(e, item.site.id, item.site.name)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Monitored Worksite"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

              {/* BOTTOM SECTION: UPCOMING HEAT WINDOW */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
                <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <h2 className="font-bold text-slate-900 text-base">Upcoming Heat Window</h2>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    Target Site: <strong className="text-slate-900">{selectedAnalysis?.site.name || 'Selected Worksite'}</strong>
                  </span>
                </div>

                {selectedAnalysis?.temperature ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Morning Window */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex justify-between text-xs text-slate-500 font-semibold">
                        <span>Morning Window</span>
                        <span>08:00 - 11:00</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-bold text-slate-800">
                          {(selectedAnalysis.temperature.min).toFixed(1)}°C
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Moderate
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">Standard shift commencement; monitor initial hydration.</p>
                    </div>

                    {/* Midday Peak Window (Highlighted) */}
                    <div className="p-4 rounded-xl bg-orange-50 border-2 border-orange-500/80 space-y-2 relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-md uppercase tracking-wider">
                        Peak Heat
                      </div>
                      <div className="flex justify-between text-xs text-orange-800 font-bold">
                        <span>Midday Peak</span>
                        <span>11:00 - 15:00</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-extrabold text-orange-950">
                          {(selectedAnalysis.temperature.max).toFixed(1)}°C
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-600 text-white">
                          {selectedAnalysis.risk?.level || 'High'}
                        </span>
                      </div>
                      <p className="text-[11px] text-orange-900 font-medium">
                        Critical microclimate zone thermal strain. Enforce shade & mandatory rest breaks.
                      </p>
                    </div>

                    {/* Late Afternoon Window */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex justify-between text-xs text-slate-500 font-semibold">
                        <span>Late Afternoon</span>
                        <span>15:00 - 18:00</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-bold text-slate-800">
                          {(selectedAnalysis.temperature.current).toFixed(1)}°C
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          Elevated
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">Sustained thermal radiation off hardscaping & roofing material.</p>
                    </div>

                    {/* Evening Shift Window */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex justify-between text-xs text-slate-500 font-semibold">
                        <span>Evening Shift</span>
                        <span>18:00 - 21:00</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-bold text-slate-800">
                          {(selectedAnalysis.temperature.min + 1.5).toFixed(1)}°C
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Cooling
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">Cooling trend begins; safe for essential outdoor prep tasks.</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 text-sm bg-slate-50 rounded-xl border border-slate-200/80">
                    {selectedAnalysis?.error || 'FortyGuard thermal forecast data currently unavailable for this location.'}
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </main>

      {/* 3. OPERATIONAL RISK DRAWER (Independently Scrollable Side Sheet) */}
      {isOperationalRiskOpen && selectedAnalysis && (
        <>
          {/* Backdrop Overlay - Clicking closes drawer */}
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 transition-opacity"
            onClick={() => setIsOperationalRiskOpen(false)}
          />

          {/* Side Drawer Sheet */}
          <div 
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col h-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Panel Header (Non-scrolling flex header) */}
            <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-900 text-white flex-shrink-0">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono text-orange-400 font-bold">
                  Site Intelligence Record
                </span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedAnalysis.site.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedAnalysis.site.city}, {selectedAnalysis.site.state} • Lat: {selectedAnalysis.site.lat}, Lng: {selectedAnalysis.site.lng}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handlePromptDelete(e, selectedAnalysis.site.id, selectedAnalysis.site.name)}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Remove Monitored Worksite"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOperationalRiskOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Close Operational Risk Panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Panel Body (Independently scrollable) */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto text-slate-800">
              
              {/* CURRENT CONDITIONS & RISK */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Current Temperature
                  </span>
                  <p className="text-2xl font-bold text-slate-900">
                    {selectedAnalysis.temperature ? `${selectedAnalysis.temperature.current.toFixed(1)}°C` : 'N/A'}
                  </p>
                  {selectedAnalysis.temperature && (
                    <p className="text-xs text-slate-500 mt-0.5 font-mono">
                      {((selectedAnalysis.temperature.current * 9 / 5) + 32).toFixed(1)}°F Mean
                    </p>
                  )}
                </div>

                <div className="bg-orange-50/60 p-4 rounded-xl border border-orange-200">
                  <span className="text-[11px] font-semibold text-orange-800 uppercase tracking-wider block mb-1">
                    HeatShield Risk
                  </span>
                  <p className="text-2xl font-bold text-orange-950">
                    {selectedAnalysis.risk?.score ?? 'N/A'} <span className="text-xs text-slate-600 font-normal">/ 100</span>
                  </p>
                  <span className="inline-block text-xs font-bold px-2 py-0.5 rounded bg-orange-600 text-white mt-1">
                    {selectedAnalysis.risk?.level || 'Unknown'} Level
                  </span>
                </div>
              </div>

              {/* UPCOMING PEAK */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-orange-500" />
                  Upcoming Peak Period
                </h3>
                <p className="text-sm font-semibold text-slate-800">
                  {selectedAnalysis.temperature?.max 
                    ? `12:00 PM – 4:00 PM (Peak Surface Temp: ${selectedAnalysis.temperature.max.toFixed(1)}°C / ${((selectedAnalysis.temperature.max * 9 / 5) + 32).toFixed(1)}°F)`
                    : 'Supported peak forecast unavailable for current location.'}
                </p>
              </div>

              {/* WHY THIS SITE IS FLAGGED */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  Why This Site Is Flagged
                </h3>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                  {selectedAnalysis.risk?.factors && selectedAnalysis.risk.factors.length > 0 ? (
                    selectedAnalysis.risk.factors.map((factor, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                        <span>{factor}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">
                      {selectedAnalysis.error || 'No elevated risk factors detected.'}
                    </p>
                  )}
                </div>
              </div>

              {/* RECOMMENDED OPERATIONAL ACTION */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Recommended Operational Action
                </h3>
                <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80 text-xs text-emerald-950 font-medium leading-relaxed">
                  {selectedAnalysis.risk?.recommendation || 'Standard safety operating procedures apply.'}
                </div>
              </div>

              {/* DATA PROVENANCE & TIMESTAMP */}
              <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span>Data Source:</span>
                  <span className="font-semibold text-slate-800">FortyGuard Temperature API®</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span>{lastUpdated ? lastUpdated.toLocaleTimeString() : 'Just now'}</span>
                </div>
              </div>

              {/* DRAWER FOOTER ACTIONS */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={(e) => handlePromptDelete(e, selectedAnalysis.site.id, selectedAnalysis.site.name)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Monitored Site</span>
                </button>
              </div>

            </div>
          </div>
        </>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {siteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Remove Monitored Site?</h3>
                <p className="text-xs text-slate-500 mt-0.5">Confirm permanent site removal</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              Are you sure you want to remove <strong className="text-slate-900">"{siteToDelete.name}"</strong> from FortyGuard heat monitoring? This action is permanent and will stop thermal exposure tracking for this worksite.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSiteToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteSite}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md shadow-red-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Removing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Site</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
