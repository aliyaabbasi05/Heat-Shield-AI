import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Product', href: '#product' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Why FortyGuard', href: '#why-fortyguard' },
    { name: 'Use Cases', href: '#use-cases' },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-[#09090B]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg italic leading-none">H</span>
            </div>
            <span className="font-semibold text-xl tracking-tight text-[#FAFAFA]">
              HeatShield <span className="text-orange-500">AI</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center h-9 px-5 font-bold text-sm text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
            >
              Launch App
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900 p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#111114] border-b border-white/10 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-white/70 hover:text-white hover:bg-white/5"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2">
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex w-full justify-center items-center h-10 px-4 font-bold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
            >
              Launch App
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
