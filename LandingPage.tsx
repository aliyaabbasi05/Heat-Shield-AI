import { useEffect } from 'react';
import Navigation from '../components/landing/Navigation';
import Hero from '../components/landing/Hero';
import Problem from '../components/landing/Problem';
import Solution from '../components/landing/Solution';
import WhyFortyGuard from '../components/landing/WhyFortyGuard';
import Workflow from '../components/landing/Workflow';
import UseCases from '../components/landing/UseCases';
import CoreValue from '../components/landing/CoreValue';
import AgentSection from '../components/landing/AgentSection';
import DataTrust from '../components/landing/DataTrust';
import ProductPreview from '../components/landing/ProductPreview';
import CommercialValue from '../components/landing/CommercialValue';
import FinalCTA from '../components/landing/FinalCTA';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA] font-sans selection:bg-orange-500/30 selection:text-orange-200 flex flex-col">
      <Navigation />
      
      <main id="product" className="flex-1 p-4 sm:p-6 pt-24 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 auto-rows-min">
        <div className="lg:col-span-7 flex"><Hero /></div>
        <div className="lg:col-span-5 flex"><ProductPreview /></div>
        <div className="lg:col-span-4 flex"><Solution /></div>
        <div className="lg:col-span-5 flex"><WhyFortyGuard /></div>
        <div className="lg:col-span-3 flex"><UseCases /></div>
        <div className="lg:col-span-12 flex"><Workflow /></div>
        <div className="lg:col-span-12 flex"><Problem /></div>
        <div className="lg:col-span-12 flex"><CoreValue /></div>
        <div className="lg:col-span-12 flex"><AgentSection /></div>
        <div className="lg:col-span-12 flex"><DataTrust /></div>
        <div className="lg:col-span-12 flex"><CommercialValue /></div>
        <div className="lg:col-span-12 flex"><FinalCTA /></div>
      </main>
      
      <Footer />
    </div>
  );
}
