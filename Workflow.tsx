import { MessageSquare, ServerCog, ShieldCheck, FileText, ArrowDown } from 'lucide-react';

export default function Workflow() {
  return (
    <section className="w-full bg-[#111114] border border-white/10 rounded-3xl p-6 lg:p-12 overflow-hidden relative">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FAFAFA] mb-6">
            Conversational Agent Workflow
          </h2>
          <p className="text-lg text-white/50">
            A natural-language workflow designed for operational speed.
          </p>
        </div>

        <div className="bg-[#09090B] rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-6 md:p-10">
          
          {/* Ask Phase */}
          <div className="relative pb-12">
            <div className="absolute left-8 top-16 bottom-0 w-px bg-white/10"></div>
            <div className="flex gap-6 items-start">
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 border border-orange-500/20">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div className="pt-2">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-2">Ask</h3>
                <div className="bg-white/5 rounded-2xl rounded-tl-none p-5 border border-white/10 inline-block">
                  <p className="text-white/90 font-medium italic">
                    "Monitor my Phoenix construction sites today and identify where heat risk needs attention."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Analyze Phase */}
          <div className="relative pb-12">
            <div className="absolute left-8 top-16 bottom-0 w-px bg-white/10"></div>
            <div className="flex gap-6 items-start">
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/5 text-white/60 flex items-center justify-center shrink-0 border border-white/10">
                <ServerCog className="w-8 h-8" />
              </div>
              <div className="pt-2 w-full">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-2">Analyze</h3>
                <div className="bg-[#111114] rounded-2xl p-4 border border-white/10 shadow-sm flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <p className="text-white/60 text-sm">Agent identifies workflow and retrieves FortyGuard intelligence.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prioritize Phase */}
          <div className="relative pb-12">
            <div className="absolute left-8 top-16 bottom-0 w-px bg-white/10"></div>
            <div className="flex gap-6 items-start">
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/5 text-white/60 flex items-center justify-center shrink-0 border border-white/10">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="pt-2 w-full">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-2">Prioritize</h3>
                <div className="bg-[#111114] rounded-2xl p-4 border border-white/10 shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/5">
                    <span className="text-sm font-medium text-white/80">Site Alpha (Downtown)</span>
                    <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded">High Risk</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/5">
                    <span className="text-sm font-medium text-white/80">Site Beta (North)</span>
                    <span className="text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded">Elevated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Act & Report Phase */}
          <div className="relative">
            <div className="flex gap-6 items-start">
              <div className="relative z-10 w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center shrink-0 shadow-md">
                <FileText className="w-8 h-8" />
              </div>
              <div className="pt-2 w-full">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider mb-2">Act & Report</h3>
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <p className="text-white/90 font-medium mb-3">Manager Operations Brief</p>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                      Shift adjustments recommended for Site Alpha.
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40"></div>
                      Cooling station audit required at Site Beta.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
