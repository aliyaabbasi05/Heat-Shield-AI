import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import Sidebar from '../components/Sidebar';
import AgentCommandBar from '../components/AgentCommandBar';
import SiteRiskList from '../components/SiteRiskList';
import { AgentResponse } from '../types';

export default function Dashboard() {
  const [agentResponse, setAgentResponse] = useState<AgentResponse | null>(null);
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const [fgStatus, setFgStatus] = useState<{ state: number; label: string } | null>(null);

  useEffect(() => {
    fetch('/api/fortyguard/test-connection')
      .then(res => res.json())
      .then(data => {
        setFgStatus({ state: data.state, label: data.stateLabel });
      })
      .catch(() => {
        setFgStatus({ state: 3, label: 'Connection Error' });
      });
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto min-w-0 pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto p-8">
          
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Heat Operations Center</h1>
            <p className="text-slate-500 mt-2">Turn hyperlocal heat intelligence into operational decisions.</p>
          </header>

          <AgentCommandBar 
            onResponse={setAgentResponse} 
            onLoading={setIsAgentLoading} 
          />

          {isAgentLoading && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-5 h-5 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>
                <p className="font-medium animate-pulse">HeatShield Agent is analyzing...</p>
              </div>
            </div>
          )}

          {agentResponse && !isAgentLoading && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Agent Analysis</h2>
              
              {agentResponse.error ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 border border-red-200 text-sm">
                  <strong>Error:</strong> {agentResponse.error}
                </div>
              ) : (
                <>
                  {agentResponse.actionLog && agentResponse.actionLog.length > 0 && (
                    <div className="bg-slate-50 rounded-lg p-4 mb-4">
                      <h3 className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">Audit Trail</h3>
                      <ul className="space-y-1">
                        {agentResponse.actionLog.map((log, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            {log}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-headings:font-semibold">
                    <div className="markdown-body">
                      <Markdown>{agentResponse.text || ''}</Markdown>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Main Dashboard Content below */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SiteRiskList />
            </div>
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">System Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">FortyGuard API</span>
                    {fgStatus === null ? (
                      <span className="text-xs text-slate-400 animate-pulse">Checking...</span>
                    ) : fgStatus.state === 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Connected
                      </span>
                    ) : fgStatus.state === 4 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Connected (No Data)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        {fgStatus.label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Gemini Agent</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      Online
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
