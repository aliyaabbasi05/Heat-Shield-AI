import { useState } from 'react';
import { Bot, Send, Loader2 } from 'lucide-react';
import { AgentResponse } from '../types';

interface AgentCommandBarProps {
  onResponse: (res: AgentResponse, userPrompt?: string) => void;
  onLoading: (isLoading: boolean) => void;
}

export default function AgentCommandBar({ onResponse, onLoading }: AgentCommandBarProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const executeCommand = async (commandText: string) => {
    const textToSubmit = commandText.trim();
    if (!textToSubmit || loading) return;

    setLoading(true);
    onLoading(true);

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSubmit })
      });

      const data = await response.json().catch(() => ({
        error: `Invalid JSON response from server (HTTP ${response.status})`
      }));

      if (!response.ok || data.error) {
        onResponse({
          text: '',
          actionLog: ['Connection to HeatShield Agent failed'],
          error: data.error || `Server returned error status ${response.status}`
        }, textToSubmit);
      } else {
        onResponse({
          text: data.text || 'No response output returned by agent.',
          actionLog: data.actionLog || ['Command executed successfully'],
        }, textToSubmit);
      }
    } catch (err: any) {
      console.error('Agent submit error:', err);
      onResponse({
        text: '',
        actionLog: ['Network error encountered'],
        error: err.message || 'Failed to communicate with HeatShield Agent server.'
      }, textToSubmit);
    } finally {
      setLoading(false);
      onLoading(false);
      setPrompt('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(prompt);
  };

  const handlePresetClick = (presetText: string) => {
    setPrompt(presetText);
    executeCommand(presetText);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Bot className="h-5 w-5 text-orange-500" />
        </div>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask HeatShield to analyze your sites, assess risk, or generate briefs..."
          className="block w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow text-sm sm:text-base"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="absolute inset-y-2 right-2 px-3.5 flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white rounded-md disabled:opacity-50 transition-colors cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide text-xs">
        <span className="text-slate-500 font-medium whitespace-nowrap">Suggested prompts:</span>
        <button 
          type="button"
          onClick={() => handlePresetClick('Monitor my Phoenix construction sites today and identify which locations need attention.')} 
          className="bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200/60 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
        >
          Monitor Phoenix sites
        </button>
        <button 
          type="button"
          onClick={() => handlePresetClick('Which site has the highest heat risk right now?')} 
          className="bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
        >
          Highest risk worksite
        </button>
        <button 
          type="button"
          onClick={() => handlePresetClick('Generate today\'s heat operations brief for managers.')} 
          className="bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer"
        >
          Operations brief
        </button>
      </div>
    </div>
  );
}
