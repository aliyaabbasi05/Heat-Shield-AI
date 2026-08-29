import { ArrowRight, Thermometer, Map as MapIcon, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-br from-[#18181B] to-[#09090B] border border-white/10 rounded-3xl p-8 lg:p-12 relative overflow-hidden flex flex-col justify-center gap-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="relative z-10 text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest mb-6 border border-orange-500/20">
            Enterprise Heat Intelligence
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#FAFAFA] tracking-tight mb-6 leading-[1.1]"
        >
          Turn Hyperlocal Heat <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
            Intelligence Into Action
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-white/50 mb-10 max-w-xl leading-relaxed"
        >
          An agentic heat-risk operations platform that uses FortyGuard's street-level temperature intelligence to help outdoor operations teams identify where heat risk is highest, when conditions may peak, and where attention is needed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 font-bold text-black bg-white rounded-xl hover:bg-white/90 transition-colors gap-2"
          >
            Launch Heat Operations Center
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 font-bold text-white bg-transparent border border-white/20 rounded-xl hover:bg-white/5 transition-colors"
          >
            See How It Works
          </a>
        </motion.div>
      </div>
    </section>
  );
}
