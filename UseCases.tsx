import { HardHat, Zap, Factory, Wrench } from 'lucide-react';

export default function UseCases() {
  const cases = [
    {
      title: "Construction",
      desc: "Prioritize attention across active worksites.",
      icon: HardHat,
      highlight: true
    },
    {
      title: "Utilities",
      desc: "Monitor distributed field locations.",
      icon: Zap,
      highlight: false
    },
    {
      title: "Infrastructure",
      desc: "Identify locations requiring operational review.",
      icon: Factory,
      highlight: false
    },
    {
      title: "Field Services",
      desc: "Understand heat conditions across outdoor operations.",
      icon: Wrench,
      highlight: false
    }
  ];

  return (
    <section id="use-cases" className="w-full bg-orange-600 rounded-3xl p-6 lg:p-8 flex flex-col justify-between text-white shadow-2xl shadow-orange-600/20 h-full relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500 rounded-full blur-3xl opacity-50"></div>
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold leading-tight mb-2">Built for Heat-Exposed Operations</h3>
        <p className="text-sm text-white/80 mt-2 mb-6">Designed for:</p>
        <ul className="text-base space-y-3 font-medium">
          <li className="flex items-center gap-2">
            <HardHat className="w-5 h-5 text-orange-200" />
            Construction Sites
          </li>
          <li className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-200" />
            Utilities & Field Techs
          </li>
          <li className="flex items-center gap-2">
            <Factory className="w-5 h-5 text-orange-200" />
            Public Infrastructure
          </li>
          <li className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-200" />
            Field Services
          </li>
        </ul>
      </div>
      
      <div className="mt-8 flex items-center justify-between relative z-10 pt-4 border-t border-orange-500/30">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-100">Ready to Scale</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-200">
          <path d="M5 12h14M12 5l7 7-7 7"></path>
        </svg>
      </div>
    </section>
  );
}
