import { Bot, CheckCircle2, ChevronRight } from 'lucide-react';

export default function AgentSection() {
  const actions = [
    "Request received",
    "Sites identified",
    "FortyGuard queried",
    "Conditions analyzed",
    "Risk ranked",
    "Brief generated"
  ];

  return (
    <section className="w-full bg-[#111114] border border-white/10 rounded-3xl p-6 lg:p-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className="bg-[#09090B] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Bot className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Agent Activity log</h3>
                  <p className="text-xs text-white/40 font-mono">Real-time task execution</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {actions.map((action, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0 border border-orange-500/20">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      {idx !== actions.length - 1 && (
                        <div className="w-px h-4 bg-white/10 mt-1"></div>
                      )}
                    </div>
                    <span className="font-medium text-white/80 text-sm pb-1">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex-1 order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-[#FAFAFA] mb-6">
              An AI Agent That Turns Heat Questions Into Workflows
            </h2>
            <p className="text-lg text-white/50 mb-8 leading-relaxed">
              HeatShield is not simply a chatbot. It employs a dedicated AI agent capable of orchestrating complex backend tasks. When a manager makes an operational request, the agent interprets the goal, identifies the required data, calls approved FortyGuard tools, and executes a structured analysis.
            </p>
            
            <ul className="space-y-4">
              {[
                "Interpret operational requests naturally",
                "Retrieve FortyGuard intelligence via tools",
                "Analyze and rank risk transparently",
                "Generate auditable operations briefs"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center mt-0.5 shrink-0 border border-orange-500/20">
                    <ChevronRight className="w-3 h-3 text-orange-400" />
                  </div>
                  <span className="text-white/80 font-medium text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
