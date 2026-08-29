import { ThermometerSun, Map, Clock, Baseline } from 'lucide-react';

export default function WhyFortyGuard() {
  const capabilities = [
    {
      title: "Hyper-local ambient temperature",
      icon: ThermometerSun,
    },
    {
      title: "Street & asset-level resolution",
      icon: Map,
    },
    {
      title: "Historical intelligence",
      icon: Clock,
    },
    {
      title: "Current-day conditions",
      icon: Baseline,
    }
  ];

  return (
    <section id="why-fortyguard" className="w-full bg-[#111114] border border-white/10 rounded-3xl p-6 lg:p-8 flex flex-col relative h-full">
      <div className="absolute bottom-0 right-0 p-4 opacity-10">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
          <circle cx="12" cy="12" r="4"></circle>
        </svg>
      </div>
      
      <h3 className="text-xl font-bold mb-2 text-[#FAFAFA]">Powered by FortyGuard</h3>
      <p className="text-sm text-white/40 mb-8 max-w-sm">
        Street-level temperature intelligence refined for high-stakes operational decision making.
      </p>
      
      <div className="grid grid-cols-2 gap-y-8 gap-x-4 mt-auto z-10">
        <div className="border-l-2 border-orange-500 pl-4 py-1">
          <p className="text-xl font-bold text-white">Hyper-Local</p>
          <p className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Ambient Accuracy</p>
        </div>
        <div className="border-l-2 border-orange-500 pl-4 py-1">
          <p className="text-xl font-bold text-white">Block-Level</p>
          <p className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Spatial Resolution</p>
        </div>
        <div className="border-l-2 border-white/10 pl-4 py-1">
          <p className="text-xl font-bold text-white">Historical</p>
          <p className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Contextual Data</p>
        </div>
        <div className="border-l-2 border-white/10 pl-4 py-1">
          <p className="text-xl font-bold text-white">Forecasting</p>
          <p className="text-[10px] uppercase tracking-wider text-white/40 mt-1">Risk Mitigation</p>
        </div>
      </div>
    </section>
  );
}
