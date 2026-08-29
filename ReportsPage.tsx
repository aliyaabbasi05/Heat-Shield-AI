import Sidebar from '../components/Sidebar';
import { FileText } from 'lucide-react';
import Markdown from 'react-markdown';
import { useState } from 'react';
import { AgentResponse } from '../types';

export default function ReportsPage() {
  const [report, setReport] = useState<AgentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateReport = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "Generate today's comprehensive heat operations brief." })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setReport(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto min-w-0 pt-14 md:pt-0">
        <div className="max-w-4xl mx-auto p-8">
          <header className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Operations Reports</h1>
                <p className="text-slate-500 mt-2">Generate AI-driven risk summaries.</p>
              </div>
            </div>
            <button 
              onClick={generateReport}
              disabled={loading}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Generating...' : 'Generate New Brief'}
            </button>
          </header>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 border border-red-200">
              {error}
            </div>
          )}

          {loading && (
             <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center">
               <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-orange-500 animate-spin mx-auto mb-4"></div>
               <p className="text-slate-600 font-medium">Analyzing sites and generating report...</p>
             </div>
          )}

          {report && !loading && (
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="prose prose-slate max-w-none prose-headings:font-semibold markdown-body">
                <Markdown>{report.text}</Markdown>
              </div>
            </div>
          )}

          {!report && !loading && !error && (
            <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">No Reports Generated</h2>
              <p className="text-slate-500 mb-6">Run a successful FortyGuard analysis before generating the operations brief.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
