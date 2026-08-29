import { AlertTriangle, MapPin, Search, BarChart3 } from 'lucide-react';

export default function Problem() {
  return (
    <section id="problem" className="w-full bg-[#111114] border border-white/10 rounded-3xl p-6 lg:p-12 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FAFAFA] mb-4">
            Heat Doesn't Happen Uniformly
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Traditional weather information can be too coarse for operational decisions. Two worksites in the same city can experience entirely different environmental conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#09090B] rounded-2xl p-6 border border-white/10 relative overflow-hidden group hover:border-orange-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-2xl rounded-full"></div>
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 mb-6">
              <MapPin className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Where risk is highest</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Operations teams need location-specific temperature intelligence to understand precisely which sites are experiencing extreme conditions.
            </p>
          </div>

          <div className="bg-[#09090B] rounded-2xl p-6 border border-white/10 relative overflow-hidden group hover:border-orange-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-2xl rounded-full"></div>
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 mb-6">
              <BarChart3 className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">When conditions peak</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Broad city-wide forecasts mask the hyperlocal temperature spikes that require immediate operational adjustments and rescheduling.
            </p>
          </div>

          <div className="bg-[#09090B] rounded-2xl p-6 border border-white/10 relative overflow-hidden group hover:border-orange-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-2xl rounded-full"></div>
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 mb-6">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">What needs attention</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Without precise data, managers struggle to identify which specific locations require priority attention and preventative measures.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
