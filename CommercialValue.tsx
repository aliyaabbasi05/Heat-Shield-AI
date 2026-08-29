import { TrendingUp, Layers, CheckSquare } from 'lucide-react';

export default function CommercialValue() {
  const benefits = [
    {
      title: "Faster Heat-Risk Assessment",
      desc: "Reduce the time spent manually checking disparate weather forecasts.",
      icon: TrendingUp
    },
    {
      title: "Location-Level Prioritization",
      desc: "Stop treating entire cities uniformly. Allocate attention where it is actually needed.",
      icon: Layers
    },
    {
      title: "Auditable Reporting",
      desc: "Generate structured recommendations for a clear operational paper trail.",
      icon: CheckSquare
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Built for Real Operational Decisions
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              HeatShield helps organizations turn temperature intelligence into a repeatable operational workflow, ensuring that environmental risk is managed systematically rather than reactively.
            </p>
            <div className="space-y-6">
              {benefits.map((b, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                    <b.icon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-1">{b.title}</h4>
                    <p className="text-slate-600">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-slate-100 rounded-[2rem] transform rotate-3"></div>
            <div className="bg-slate-900 rounded-[2rem] p-10 relative overflow-hidden text-white shadow-xl">
               <div className="absolute top-0 right-0 p-12 opacity-10">
                 <TrendingUp className="w-48 h-48" />
               </div>
               <div className="relative z-10">
                 <h3 className="text-2xl font-bold mb-4">The Cost of Ambiguity</h3>
                 <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                   Without precise intelligence, organizations either overreact—suspending operations unnecessarily—or underreact, exposing teams to unmeasured risk. HeatShield provides the clarity needed to operate safely and efficiently.
                 </p>
                 <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
                   <p className="font-mono text-sm text-slate-300">
                     "We need to know not just that it's hot, but exactly which sites have crossed the operational threshold."
                   </p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
