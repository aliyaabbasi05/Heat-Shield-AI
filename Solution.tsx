import { Search, BrainCircuit, ListOrdered, ShieldAlert } from 'lucide-react';

export default function Solution() {
  const steps = [
    {
      num: '01',
      title: 'Detect',
      desc: 'Retrieve real temperature intelligence from FortyGuard.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Analyze',
      desc: 'Evaluate monitored worksites using current, historical, and supported forecast information.',
      icon: BrainCircuit,
    },
    {
      num: '03',
      title: 'Prioritize',
      desc: "Rank locations according to HeatShield's transparent operational risk score.",
      icon: ListOrdered,
    },
    {
      num: '04',
      title: 'Act',
      desc: 'Generate recommendations and an operations brief for managers.',
      icon: ShieldAlert,
    }
  ];

  return (
    <section className="w-full bg-[#111114] border border-white/10 rounded-3xl p-6 lg:p-8 flex flex-col gap-6 h-full">
      <h3 className="text-xl font-bold text-[#FAFAFA]">Ask. Analyze. Act.</h3>
      
      <div className="flex flex-col gap-4 flex-1 justify-center">
        <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
          <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">01</div>
          <div>
            <p className="text-sm font-bold text-white/90">DETECT</p>
            <p className="text-xs text-white/40 mt-1">Retrieve real intelligence from FortyGuard API</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
          <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center text-xs font-bold text-orange-400 shrink-0">02</div>
          <div>
            <p className="text-sm font-bold text-white/90">ANALYZE</p>
            <p className="text-xs text-white/40 mt-1">Evaluate sites using current & forecast data</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
          <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center text-xs font-bold text-red-400 shrink-0">03</div>
          <div>
            <p className="text-sm font-bold text-white/90">PRIORITIZE</p>
            <p className="text-xs text-white/40 mt-1">Rank locations by operational risk score</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
          <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center text-xs font-bold text-green-400 shrink-0">04</div>
          <div>
            <p className="text-sm font-bold text-white/90">ACT</p>
            <p className="text-xs text-white/40 mt-1">Generate automated operations briefs</p>
          </div>
        </div>
      </div>
    </section>
  );
}
