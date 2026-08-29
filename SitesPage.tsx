import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import SiteSearchSelector from '../components/SiteSearchSelector';
import { Site } from '../types';
import { Trash2, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const res = await fetch('/api/sites');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSites(data);
      }
    } catch (err) {
      console.error('Failed to fetch sites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSite = async (siteData: {
    name: string;
    city: string;
    state: string;
    lat: number;
    lng: number;
    placeId?: string;
    formattedAddress?: string;
  }) => {
    setAdding(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: siteData.name,
          city: siteData.city,
          state: siteData.state,
          lat: siteData.lat,
          lng: siteData.lng,
          siteType: 'Construction',
          notes: siteData.formattedAddress ? `Address: ${siteData.formattedAddress}${siteData.placeId ? ` | PlaceID: ${siteData.placeId}` : ''}` : undefined
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to save site.');
      }

      setSuccess(`✓ Monitored site "${data.name}" confirmed and saved with exact coordinates (${Number(data.lat).toFixed(4)}, ${Number(data.lng).toFixed(4)}).`);
      await fetchSites();
    } catch (err: any) {
      console.error('Failed to add site:', err);
      setError(err.message || 'Error saving site to database.');
      throw err;
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string, siteName: string) => {
    if (!confirm(`Are you sure you want to remove "${siteName}"?`)) return;
    try {
      await fetch(`/api/sites/${id}`, { method: 'DELETE' });
      setSuccess(`Site "${siteName}" removed.`);
      fetchSites();
    } catch (err) {
      console.error(err);
      setError('Failed to delete site.');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto min-w-0 pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto p-6 md:p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Monitored Worksites</h1>
            <p className="text-slate-500 mt-2">
              Search and add locations to monitor thermal exposure with FortyGuard intelligence.
            </p>
          </header>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* SEARCH-BASED ADD SITE PANEL */}
            <div className="lg:col-span-5">
              <SiteSearchSelector onAddSite={handleAddSite} isAdding={adding} />
            </div>

            {/* ACTIVE SITES LIST PANEL */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Active Worksites</h2>
                    <p className="text-xs text-slate-500">{sites.length} locations being monitored</p>
                  </div>
                  <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
                    FortyGuard Ready
                  </span>
                </div>

                {loading ? (
                  <div className="p-12 text-center text-slate-500 text-sm">
                    Loading worksites...
                  </div>
                ) : sites.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-sm">
                    No worksites added yet. Use the search panel on the left to add your first site.
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {sites.map(site => (
                      <li key={site.id} className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                        <div className="flex items-start gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-slate-900 truncate">{site.name}</h3>
                            <p className="text-xs text-slate-500 mt-0.5">{site.city}, {site.state}</p>
                            <p className="text-[11px] text-slate-400 mt-1 font-mono">
                              Lat: {Number(site.lat).toFixed(4)} | Lng: {Number(site.lng).toFixed(4)}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDelete(site.id, site.name)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-4"
                          title="Delete Site"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
