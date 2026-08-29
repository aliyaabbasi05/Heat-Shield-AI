import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, AlertTriangle, CheckCircle2, X, RefreshCw, Building2, Landmark, Compass, Navigation } from 'lucide-react';
import LocationMapPreview from './LocationMapPreview';

export interface LocationSearchResult {
  id: string;
  provider: 'osm_nominatim' | 'komoot_photon';
  placeId: string;
  name: string;
  formattedAddress: string;
  address: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  isUS: boolean;
  lat: number;
  lng: number;
  category: string;
  isSpecific: boolean;
  tier: number;
}

interface SiteSearchSelectorProps {
  onAddSite: (siteData: {
    name: string;
    city: string;
    state: string;
    lat: number;
    lng: number;
    placeId?: string;
    formattedAddress?: string;
  }) => Promise<void>;
  isAdding: boolean;
}

export default function SiteSearchSelector({ onAddSite, isAdding }: SiteSearchSelectorProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const [selectedLocation, setSelectedLocation] = useState<LocationSearchResult | null>(null);
  const [friendlyName, setFriendlyName] = useState('');

  const [formError, setFormError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if current search query looks like a specific place request (2+ words)
  const isMultiWordSearch = query.trim().split(/\s+/).length >= 2;
  const hasOnlyCityResults = suggestions.length > 0 && suggestions.every(s => !s.isSpecific);

  // Debounced Location Search Effect
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      setSearchError(null);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setShowDropdown(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/location/search?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal
        });
        
        if (!res.ok) {
          throw new Error('Location search request failed');
        }

        const data: LocationSearchResult[] = await res.json();
        setSuggestions(data);
        setHighlightedIndex(-1);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Location search error:', err);
          setSearchError('Location search is temporarily unavailable.');
          setSuggestions([]);
        }
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (loc: LocationSearchResult) => {
    setSelectedLocation(loc);
    setFriendlyName(loc.name || loc.city || 'Monitored Worksite');
    setShowDropdown(false);
    setSuggestions([]);
    setFormError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelectLocation(suggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleResetSelection = () => {
    setSelectedLocation(null);
    setFriendlyName('');
    setFormError(null);
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocation) return;

    if (!selectedLocation.isUS) {
      setFormError('HeatShield currently supports U.S. locations because FortyGuard temperature coverage is U.S.-only.');
      return;
    }

    if (!friendlyName.trim()) {
      setFormError('Please enter a valid Site Name.');
      return;
    }

    try {
      setFormError(null);
      await onAddSite({
        name: friendlyName.trim(),
        city: selectedLocation.city || selectedLocation.name || 'Monitored Site',
        state: selectedLocation.state || 'US',
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        placeId: selectedLocation.placeId,
        formattedAddress: selectedLocation.formattedAddress
      });

      // Reset on success
      setSelectedLocation(null);
      setFriendlyName('');
      setQuery('');
    } catch (err: any) {
      console.error('Failed to submit site:', err);
      setFormError(err.message || 'Error saving site.');
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes('Building')) return <Building2 className="w-3.5 h-3.5" />;
    if (category.includes('Point of Interest') || category.includes('Landmark')) return <Landmark className="w-3.5 h-3.5" />;
    if (category.includes('Venue') || category.includes('Campus')) return <Navigation className="w-3.5 h-3.5" />;
    return <Compass className="w-3.5 h-3.5" />;
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Add Monitored Site</h3>
        <p className="text-xs text-slate-500 mt-1">
          Search for a specific building, POI, landmark, or address for accurate street-level heat monitoring.
        </p>
      </div>

      {formError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg font-medium flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}

      {/* SEARCH BAR (WHEN NO LOCATION IS SELECTED YET) */}
      {!selectedLocation ? (
        <div className="relative">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Search Worksites & Physical Places
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => { if (query.trim().length >= 2) setShowDropdown(true); }}
              onKeyDown={handleKeyDown}
              placeholder="Phoenix Downtown Tower, Dallas City Hall, Empire State Building..."
              className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            {query && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* WARNING WHEN SPECIFIC PLACE NOT FOUND */}
          {showDropdown && isMultiWordSearch && hasOnlyCityResults && !isSearching && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Specific place not detected in results.</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  HeatShield requires a specific physical worksite/building address for accurate microclimate coverage rather than a city center.
                </p>
              </div>
            </div>
          )}

          {/* SUGGESTIONS DROPDOWN PANEL */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-2xl z-50 overflow-hidden max-h-80 overflow-y-auto divide-y divide-slate-100"
            >
              {isSearching ? (
                <div className="p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  Locating physical worksites & addresses...
                </div>
              ) : searchError ? (
                <div className="p-4 text-center text-xs text-rose-600 bg-rose-50/50">
                  {searchError}
                </div>
              ) : suggestions.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 space-y-1">
                  <p className="font-medium text-slate-700">Specific location not found.</p>
                  <p className="text-[11px] text-slate-400">Please select a more precise building, POI, or street address.</p>
                </div>
              ) : (
                <ul className="py-1">
                  {suggestions.map((item, idx) => (
                    <li
                      key={item.id}
                      onClick={() => handleSelectLocation(item)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`px-4 py-3 cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                        highlightedIndex === idx ? 'bg-orange-50 text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className={`mt-0.5 shrink-0 ${item.isSpecific ? 'text-orange-600' : 'text-slate-400'}`}>
                          {getCategoryIcon(item.category)}
                        </div>
                        <div className="min-w-0 flex-1">
                          {/* PRIMARY PLACE NAME */}
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                          </div>
                          {/* SECONDARY FORMATTED ADDRESS */}
                          <p className="text-xs text-slate-500 truncate mt-0.5 font-normal">{item.formattedAddress}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {/* CATEGORY TAG */}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          item.isSpecific
                            ? 'bg-orange-100 text-orange-800 border border-orange-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {item.category}
                        </span>

                        {/* COUNTRY BADGE */}
                        {item.isUS ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                            U.S. Covered
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-400 rounded">
                            {item.countryCode.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      ) : (
        /* SELECTED LOCATION CONFIRMATION PANEL */
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-orange-800 bg-orange-100 px-2 py-0.5 rounded border border-orange-200">
                    Confirm Monitored Location
                  </span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded">
                    {selectedLocation.category}
                  </span>
                </div>
                {/* PRIMARY PLACE NAME */}
                <h4 className="text-lg font-extrabold text-slate-900 mt-2">{selectedLocation.name}</h4>
                {/* FORMATTED ADDRESS */}
                <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">{selectedLocation.formattedAddress}</p>
              </div>
              <button
                type="button"
                onClick={handleResetSelection}
                className="text-xs font-semibold text-orange-600 hover:text-orange-800 underline shrink-0 mt-1"
              >
                Change Location
              </button>
            </div>

            {/* Read-Only Exact Place Coordinates */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-700">
              <span>Latitude: <strong>{selectedLocation.lat.toFixed(5)}</strong></span>
              <span>Longitude: <strong>{selectedLocation.lng.toFixed(5)}</strong></span>
              <span className="text-[10px] text-slate-400 font-sans">ID: {selectedLocation.placeId.slice(0, 16)}</span>
            </div>
          </div>

          {/* NON-U.S. WARNING ALERT */}
          {!selectedLocation.isUS && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-semibold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Unsupported Location</span>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed">
                HeatShield currently supports U.S. locations because FortyGuard thermal coverage is U.S.-only.
              </p>
              <button
                type="button"
                onClick={handleResetSelection}
                className="text-xs font-semibold text-rose-800 hover:underline pt-1 inline-block"
              >
                ← Search for a U.S. location
              </button>
            </div>
          )}

          {/* MAP CONFIRMATION PREVIEW */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Worksite Map Confirmation
            </label>
            <LocationMapPreview
              lat={selectedLocation.lat}
              lng={selectedLocation.lng}
              locationName={selectedLocation.name}
            />
          </div>

          {/* EDITABLE FRIENDLY SITE NAME */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Operational Site Name
            </label>
            <input
              type="text"
              required
              value={friendlyName}
              onChange={e => setFriendlyName(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              placeholder="e.g. Phoenix Convention Center - Gate 3"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Customize the operational site label while preserving exact physical place coordinates.
            </p>
          </div>

          {/* FORM ACTIONS */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetSelection}
              className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAdding || !selectedLocation.isUS}
              className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isAdding ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving Site...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Confirm Location & Add Site
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

