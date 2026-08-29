import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FinalCTA() {
  return (
    <section className="py-24 bg-amber-500 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-amber-400 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-orange-500 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
          Ready to See the Heat?
        </h2>
        <p className="text-xl text-slate-800 mb-10 max-w-2xl mx-auto font-medium">
          Explore your monitored worksites and turn street-level temperature intelligence into operational decisions.
        </p>
        
        <Link 
          to="/dashboard"
          className="inline-flex items-center justify-center h-14 px-8 font-bold text-lg text-white bg-slate-900 rounded-xl hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-900/20 gap-3"
        >
          Launch Heat Operations Center
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
