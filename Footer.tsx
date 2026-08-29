import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center">
                <span className="text-slate-900 font-bold text-lg leading-none">H</span>
              </div>
              <span className="font-semibold text-xl tracking-tight text-white">
                HeatShield AI
              </span>
            </div>
            <p className="text-slate-400 max-w-sm">
              Turn hyperlocal heat intelligence into action.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li><a href="#product" className="hover:text-amber-500 transition-colors">Product</a></li>
              <li><a href="#how-it-works" className="hover:text-amber-500 transition-colors">How It Works</a></li>
              <li><a href="#use-cases" className="hover:text-amber-500 transition-colors">Use Cases</a></li>
              <li><Link to="/dashboard" className="text-amber-500 hover:text-amber-400 font-medium transition-colors">Launch App</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Technology</h4>
            <ul className="space-y-3">
              <li className="text-sm">
                Temperature intelligence powered by FortyGuard.
              </li>
              <li className="text-sm mt-4 text-slate-500 italic">
                Built for the FortyGuard Hackathon 2026.
              </li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} HeatShield AI. Prototype created for demonstration purposes.</p>
        </div>
      </div>
    </footer>
  );
}
