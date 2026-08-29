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

export async function searchLocations(query: string): Promise<LocationSearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const cleanQuery = query.trim();

  // Query Nominatim and Photon in parallel for maximum POI/Building coverage
  const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanQuery)}&format=json&addressdetails=1&extratags=1&namedetails=1&limit=15`;
  const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQuery)}&limit=15`;

  const headers = {
    'User-Agent': 'HeatShield-AI/1.0 (contact@heatshield.app)',
    'Accept-Language': 'en-US,en;q=0.9'
  };

  const [nomResult, photonResult] = await Promise.allSettled([
    fetch(nomUrl, { headers }).then(r => r.ok ? r.json() : []),
    fetch(photonUrl, { headers }).then(r => r.ok ? r.json() : { features: [] })
  ]);

  const rawNom = nomResult.status === 'fulfilled' && Array.isArray(nomResult.value) ? nomResult.value : [];
  const rawPhoton = photonResult.status === 'fulfilled' && photonResult.value?.features ? photonResult.value.features : [];

  const results: LocationSearchResult[] = [];

  // Helper to categorize items into specific place tiers vs city/admin
  const classifyPlace = (osmClass: string, type: string, osmKey?: string, osmVal?: string, name?: string) => {
    const c = (osmClass || '').toLowerCase();
    const t = (type || '').toLowerCase();
    const k = (osmKey || '').toLowerCase();
    const v = (osmVal || '').toLowerCase();
    const n = (name || '').toLowerCase();

    // City / Admin check
    if (
      c === 'boundary' || c === 'place' || k === 'place' ||
      t === 'administrative' || t === 'city' || t === 'town' || t === 'village' ||
      t === 'county' || t === 'state' || t === 'country' || t === 'district' || t === 'locality'
    ) {
      // Unless the name explicitly has building or monument terms
      if (!n.includes('tower') && !n.includes('hall') && !n.includes('monument') && !n.includes('building') && !n.includes('center')) {
        return { category: 'City / Area', isSpecific: false, tier: 6 };
      }
    }

    // Tier 1: Specific Building / Premise / Office
    if (
      c === 'building' || c === 'office' || k === 'building' || k === 'office' ||
      t === 'yes' || t === 'building' || t === 'office' || t === 'commercial' || t === 'industrial' ||
      n.includes('tower') || n.includes('building')
    ) {
      return { category: 'Building · Premise', isSpecific: true, tier: 1 };
    }

    // Tier 2: Point of Interest / Landmark / Monument / Historic / Government
    if (
      c === 'amenity' || c === 'tourism' || c === 'historic' || c === 'leisure' ||
      k === 'amenity' || k === 'tourism' || k === 'historic' || k === 'leisure' ||
      t === 'townhall' || t === 'monument' || t === 'attraction' || t === 'museum' ||
      n.includes('monument') || n.includes('hall') || n.includes('museum')
    ) {
      return { category: 'Point of Interest · Landmark', isSpecific: true, tier: 2 };
    }

    // Tier 3: Venue / Facility / Convention Center / Airport / Station
    if (
      c === 'aeroway' || c === 'shop' || c === 'craft' || c === 'man_made' ||
      k === 'aeroway' || k === 'shop' ||
      t === 'terminal' || t === 'aerodrome' || t === 'stadium' || t === 'convention_center' ||
      n.includes('center') || n.includes('airport') || n.includes('terminal')
    ) {
      return { category: 'Venue · Facility', isSpecific: true, tier: 3 };
    }

    // Tier 4: Campus / School / University
    if (c === 'education' || k === 'education' || t === 'university' || t === 'school' || n.includes('university') || n.includes('college')) {
      return { category: 'Campus · Site', isSpecific: true, tier: 4 };
    }

    // Tier 5: Street Address
    if (c === 'highway' || k === 'highway' || t === 'residential' || t === 'street' || t === 'house') {
      return { category: 'Street Address', isSpecific: true, tier: 5 };
    }

    // Default fallback
    return { category: 'Specific Worksite', isSpecific: true, tier: 3 };
  };

  // Process Nominatim results
  for (const item of rawNom) {
    const addr = item.address || {};
    const primaryName = item.namedetails?.name ||
      addr.amenity ||
      addr.building ||
      addr.office ||
      addr.leisure ||
      addr.shop ||
      addr.tourism ||
      addr.historic ||
      addr.aeroway ||
      item.name ||
      item.display_name.split(',')[0] ||
      cleanQuery;

    const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.suburb || '';
    const state = addr.state || addr.region || '';
    const country = addr.country || '';
    const countryCode = (addr.country_code || '').toLowerCase();
    const isUS = countryCode === 'us' || country.toLowerCase().includes('united states');

    const street = addr.road ? `${addr.house_number || ''} ${addr.road}`.trim() : '';
    const formattedAddress = [street, city, state, country].filter(Boolean).join(', ') || item.display_name;

    const { category, isSpecific, tier } = classifyPlace(item.class, item.type, undefined, undefined, primaryName);

    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);

    if (!isNaN(lat) && !isNaN(lng)) {
      results.push({
        id: `nom-${item.place_id || `${lat}-${lng}`}`,
        provider: 'osm_nominatim',
        placeId: String(item.place_id || `${lat}-${lng}`),
        name: primaryName.trim(),
        formattedAddress,
        address: formattedAddress,
        city: city.trim(),
        state: state.trim(),
        country: country.trim(),
        countryCode,
        isUS,
        lat,
        lng,
        category,
        isSpecific,
        tier
      });
    }
  }

  // Process Photon results
  for (const f of rawPhoton) {
    const p = f.properties || {};
    if (!p.name && !p.street) continue;

    const primaryName = p.name || `${p.housenumber || ''} ${p.street || ''}`.trim();
    const city = p.city || p.town || p.district || p.county || '';
    const state = p.state || '';
    const country = p.country || '';
    const countryCode = (p.countrycode || '').toLowerCase();
    const isUS = countryCode === 'us' || country.toLowerCase().includes('united states');

    const street = p.street ? `${p.housenumber || ''} ${p.street}`.trim() : '';
    const formattedAddress = [street, city, state, country].filter(Boolean).join(', ') || primaryName;

    const { category, isSpecific, tier } = classifyPlace('', p.type || '', p.osm_key, p.osm_value, primaryName);

    const coords = f.geometry?.coordinates;
    if (Array.isArray(coords) && coords.length >= 2) {
      const lng = parseFloat(coords[0]);
      const lat = parseFloat(coords[1]);

      if (!isNaN(lat) && !isNaN(lng)) {
        results.push({
          id: `photon-${p.osm_type || ''}-${p.osm_id || `${lat}-${lng}`}`,
          provider: 'komoot_photon',
          placeId: `photon-${p.osm_type || ''}-${p.osm_id || `${lat}-${lng}`}`,
          name: primaryName.trim(),
          formattedAddress,
          address: formattedAddress,
          city: city.trim(),
          state: state.trim(),
          country: country.trim(),
          countryCode,
          isUS,
          lat,
          lng,
          category,
          isSpecific,
          tier
        });
      }
    }
  }

  // Deduplicate by proximity (< 100 meters) and normalized name
  const uniqueResults: LocationSearchResult[] = [];
  for (const item of results) {
    const isDup = uniqueResults.some(existing => {
      const dist = Math.sqrt(Math.pow(existing.lat - item.lat, 2) + Math.pow(existing.lng - item.lng, 2));
      const sameName = existing.name.toLowerCase() === item.name.toLowerCase();
      return (dist < 0.001 && sameName) || existing.id === item.id;
    });
    if (!isDup) {
      uniqueResults.push(item);
    }
  }

  // Sorting priorities:
  // 1. U.S. location preference
  // 2. Specific place (building/POI/address/venue) BEFORE City / Administrative
  // 3. Lower tier number (Tier 1 building > Tier 2 landmark > Tier 3 venue > Tier 6 city)
  // 4. Name match relevance with search query
  const queryLower = cleanQuery.toLowerCase();

  return uniqueResults.sort((a, b) => {
    // US preference
    if (a.isUS && !b.isUS) return -1;
    if (!a.isUS && b.isUS) return 1;

    // Specific vs City
    if (a.isSpecific && !b.isSpecific) return -1;
    if (!a.isSpecific && b.isSpecific) return 1;

    // Direct exact or prefix match score
    const aStartsWith = a.name.toLowerCase().startsWith(queryLower);
    const bStartsWith = b.name.toLowerCase().startsWith(queryLower);
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;

    // Tier priority
    if (a.tier !== b.tier) {
      return a.tier - b.tier;
    }

    return 0;
  });
}

