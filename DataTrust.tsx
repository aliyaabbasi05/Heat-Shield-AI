import { Database, Network, ShieldCheck, ArrowDown } from 'lucide-react';

export default function DataTrust() {
  return (
    <section className="w-full bg-[#111114] border border-white/10 rounded-3xl p-6 lg:p-12 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FAFAFA] mb-4">
            Real Temperature Intelligence. Clear Provenance.
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            All temperature-derived results come directly from FortyGuard API responses. No invented metrics, no simulated heat logic.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between text-center gap-4">
          
          <div className="flex-1 bg-[#09090B] p-6 rounded-2xl border border-white/10 shadow-xl w-full relative">
            <div className="absolute inset-0 bg-blue-500/5 rounded-2xl pointer-events-none"></div>
            <Database className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h4 className="font-bold text-white mb-1">FORTYGUARD API</h4>
            <p className="text-xs text-white/40 font-mono">Source</p>
          </div>
          
          <div className="hidden md:block text-white/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </div>
          <div className="md:hidden text-white/20 py-2">
             <ArrowDown className="w-5 h-5" />
          </div>

          <div className="flex-1 bg-[#09090B] p-6 rounded-2xl border border-white/10 shadow-xl w-full relative">
            <div className="absolute inset-0 bg-orange-500/5 rounded-2xl pointer-events-none"></div>
            <Network className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <h4 className="font-bold text-white mb-1">HEATSHIELD ENGINE</h4>
            <p className="text-xs text-white/40 font-mono">Analysis & AI Agent</p>
          </div>

          <div className="hidden md:block text-white/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </div>
           <div className="md:hidden text-white/20 py-2">
             <ArrowDown className="w-5 h-5" />
          </div>

          <div className="flex-1 bg-[#09090B] p-6 rounded-2xl border border-white/10 shadow-xl w-full relative bg-gradient-to-b from-white/5 to-transparent">
            <ShieldCheck className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h4 className="font-bold text-white mb-1">OPERATIONAL OUTPUT</h4>
            <p className="text-xs text-white/40 font-mono">Timestamped Report</p>
          </div>
          
        </div>
      </div>
    </section>
  );
}
