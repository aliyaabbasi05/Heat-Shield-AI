import { MapPin, Clock, FileWarning } from 'lucide-react';

export default function CoreValue() {
  return (
    <section className="w-full bg-gradient-to-br from-[#18181B] to-[#09090B] border border-white/10 rounded-3xl p-6 lg:p-12 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FAFAFA] mb-4">
            Know Where. Know When. Know What to Review.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111114] p-8 rounded-3xl border border-white/10 hover:border-orange-500/30 transition-colors">
            <div className="text-orange-500 mb-6">
              <MapPin className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-wide text-white">WHERE</h3>
            <p className="text-white/50 leading-relaxed text-sm">
              Identify specific locations with elevated heat risk, down to the street level, preventing broad generalizations.
            </p>
          </div>

          <div className="bg-[#111114] p-8 rounded-3xl border border-white/10 hover:border-orange-500/30 transition-colors">
            <div className="text-orange-500 mb-6">
              <Clock className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-wide text-white">WHEN</h3>
            <p className="text-white/50 leading-relaxed text-sm">
              Identify upcoming periods where heat conditions may become more severe based on supported temporal intelligence.
            </p>
          </div>

          <div className="bg-[#111114] p-8 rounded-3xl border border-white/10 hover:border-orange-500/30 transition-colors">
            <div className="text-orange-500 mb-6">
              <FileWarning className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-3 tracking-wide text-white">WHAT</h3>
            <p className="text-white/50 leading-relaxed text-sm">
              Turn the environmental analysis into structured operational recommendations tailored to the site conditions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
