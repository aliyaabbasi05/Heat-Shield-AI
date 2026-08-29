import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationMapPreviewProps {
  lat: number;
  lng: number;
  locationName: string;
}

export default function LocationMapPreview({ lat, lng, locationName }: LocationMapPreviewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map instance if not created yet
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: true,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      // Create a clean custom marker HTML
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -100%);">
            <div style="width: 32px; height: 32px; background-color: #ea580c; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`<strong style="font-size: 13px;">${locationName}</strong><br/><span style="font-size: 11px; color: #64748b;">${lat.toFixed(4)}, ${lng.toFixed(4)}</span>`);

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else {
      // Map exists, update center & marker position
      const map = mapInstanceRef.current;
      map.setView([lat, lng], 14);

      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
        markerRef.current.setPopupContent(`<strong style="font-size: 13px;">${locationName}</strong><br/><span style="font-size: 11px; color: #64748b;">${lat.toFixed(4)}, ${lng.toFixed(4)}</span>`);
      }
    }

    // Invalidate size to prevent gray tiles on container resize
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [lat, lng, locationName]);

  return (
    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-200 shadow-inner bg-slate-100 z-0">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
