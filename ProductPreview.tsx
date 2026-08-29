import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductPreview() {
  return (
    <section className="w-full bg-[#111114] border border-white/10 rounded-3xl p-6 lg:p-8 flex flex-col relative overflow-hidden h-full">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-white/40">Product Preview</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-white/20"></div>
        </div>
      </div>
      
      <div className="flex-1 bg-[#09090B] border border-white/10 rounded-xl overflow-hidden shadow-2xl p-4 sm:p-6 flex flex-col relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent z-0"></div>
        
        <div className="relative z-10 flex flex-col h-full gap-4">
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-white/10 rounded"></div>
            <div className="w-12 h-2 bg-orange-500/40 rounded"></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 bg-white/5 rounded-lg border border-white/5 p-3 flex flex-col justify-end">
              <div className="w-1/2 h-1.5 bg-white/20 mb-2 rounded"></div>
              <div className="w-3/4 h-3 bg-orange-500/20 rounded"></div>
            </div>
            <div className="h-20 bg-white/5 rounded-lg border border-white/5 p-3 flex flex-col justify-end">
              <div className="w-1/2 h-1.5 bg-white/20 mb-2 rounded"></div>
              <div className="w-3/4 h-3 bg-green-500/20 rounded"></div>
            </div>
          </div>
          <div className="flex-1 min-h-[120px] bg-gradient-to-b from-orange-900/10 to-transparent rounded-lg border border-white/5 relative flex items-center justify-center">
            <div className="text-[10px] sm:text-xs uppercase tracking-tighter text-white/20 font-bold">Operational Risk Map Preview</div>
            <div className="absolute bottom-4 left-4 flex flex-col gap-2">
              <div className="w-20 h-1 bg-white/10 rounded"></div>
              <div className="w-16 h-1 bg-white/10 rounded"></div>
            </div>
          </div>
        </div>

        {/* Hover overlay CTA */}
        <Link 
          to="/dashboard"
          className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#09090B]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg shadow-white/10">
            <Play className="w-5 h-5 text-black fill-black ml-1" />
          </div>
          <span className="font-bold text-sm text-white">See in Action</span>
        </Link>
      </div>
    </section>
  );
}
