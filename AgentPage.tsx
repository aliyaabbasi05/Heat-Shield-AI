import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import Sidebar from '../components/Sidebar';
import AgentCommandBar from '../components/AgentCommandBar';
import { AgentResponse } from '../types';
import { 
  Bot, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  User, 
  RefreshCw, 
  FileText, 
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ThreadItem {
  id: string;
  userPrompt: string;
  response: AgentResponse;
  timestamp: Date;
}

export default function AgentPage() {
  const [thread, setThread] = useState<ThreadItem[]>([]);
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const [activeUserPrompt, setActiveUserPrompt] = useState<string | null>(null);
  const [collapsedLogs, setCollapsedLogs] = useState<Record<string, boolean>>({});

  const handleAgentResponse = (response: AgentResponse, userPrompt?: string) => {
    const promptText = userPrompt || activeUserPrompt || 'Analysis Request';
    const newItem: ThreadItem = {
      id: Date.now().toString(),
      userPrompt: promptText,
      response,
      timestamp: new Date()
    };
    
    setThread(prev => [newItem, ...prev]);
    setActiveUserPrompt(null);
  };

  const handleAgentLoading = (isLoading: boolean) => {
    setIsAgentLoading(isLoading);
  };

  const toggleAuditLog = (id: string) => {
    setCollapsedLogs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const clearThread = () => {
    setThread([]);
    setCollapsedLogs({});
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto min-w-0 pt-14 md:pt-0">
        <div className="max-w-4xl mx-auto p-6 md:p-8">
          
          {/* Header */}
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900">HeatShield AI Agent</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                    <Sparkles className="w-3 h-3 text-orange-600" />
                    Gemini 3.6 Flash
                  </span>
                </div>
                <p className="text-slate-500 text-sm mt-1">
                  Autonomous operational intelligence powered by FortyGuard hyper-local microclimate data.
                </p>
              </div>
            </div>

            {thread.length > 0 && (
              <button
                onClick={clearThread}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg transition-colors cursor-pointer self-start md:self-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Thread
              </button>
            )}
          </header>

          {/* Command Input Bar */}
          <AgentCommandBar 
            onResponse={handleAgentResponse} 
            onLoading={handleAgentLoading} 
          />

          {/* Loading Indicator */}
          {isAgentLoading && (
            <div className="bg-white p-6 rounded-xl border border-orange-200 shadow-sm mb-8 animate-pulse">
              <div className="flex items-center gap-3 text-orange-700">
                <div className="w-5 h-5 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>
                <div>
                  <p className="font-semibold text-sm">HeatShield Agent is executing tool calls...</p>
                  <p className="text-xs text-orange-600/80 mt-0.5">Fetching FortyGuard temperature matrices & calculating thermal risk scores</p>
                </div>
              </div>
            </div>
          )}

          {/* Thread / Interaction History */}
          <div className="space-y-6">
            {thread.map((item) => {
              const isLogCollapsed = collapsedLogs[item.id];
              const logs = item.response.actionLog || [];

              return (
                <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  
                  {/* User Prompt Bar */}
                  <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                        <User className="w-4 h-4" />
                      </div>
                      <p className="font-medium text-sm text-slate-100">{item.userPrompt}</p>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap font-mono">
                      {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="p-6">
                    {/* Audit Trail Section */}
                    {logs.length > 0 && (
                      <div className="mb-6 rounded-lg bg-slate-50 border border-slate-200/80 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleAuditLog(item.id)}
                          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 uppercase tracking-wider bg-slate-100/70 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Execution Audit Trail ({logs.length} Steps)
                          </span>
                          {isLogCollapsed ? (
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          ) : (
                            <ChevronUp className="w-4 h-4 text-slate-500" />
                          )}
                        </button>

                        {!isLogCollapsed && (
                          <div className="p-4 space-y-2 border-t border-slate-200/60 text-xs text-slate-600">
                            {logs.map((log, idx) => (
                              <div key={idx} className="flex items-start gap-2.5">
                                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px] mt-0.5">
                                  ✓
                                </span>
                                <span>{log}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Error Display */}
                    {item.response.error ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-5 text-red-800">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-sm text-red-900 mb-1">Agent Request Could Not Be Processed</h3>
                            <p className="text-xs text-red-700 leading-relaxed mb-3">
                              {item.response.error}
                            </p>
                            <div className="text-xs text-red-600 font-medium">
                              Suggestions: Check server configuration or wait a moment before trying again.
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Agent Text Output */
                      <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-p:leading-relaxed text-sm text-slate-800 markdown-body">
                        {item.response.text ? (
                          <Markdown>{item.response.text}</Markdown>
                        ) : (
                          <p className="text-slate-400 italic">No text response returned.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty Welcome State */}
          {thread.length === 0 && !isAgentLoading && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-100 shadow-inner">
                <Bot className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Ready to Assist Operations</h2>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                Ask HeatShield to query FortyGuard microclimate data, calculate thermal stress levels across your worksites, or draft operations briefs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 hover:border-orange-300 transition-colors">
                  <ShieldAlert className="w-5 h-5 text-orange-500 mb-2" />
                  <h3 className="text-xs font-semibold text-slate-900 mb-1">Heat Risk Analysis</h3>
                  <p className="text-xs text-slate-500">Evaluates peak surface heat & prolonged daily thermal stress.</p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 hover:border-orange-300 transition-colors">
                  <FileText className="w-5 h-5 text-blue-500 mb-2" />
                  <h3 className="text-xs font-semibold text-slate-900 mb-1">Operations Briefings</h3>
                  <p className="text-xs text-slate-500">Generates instant Markdown safety briefs for site supervisors.</p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 hover:border-orange-300 transition-colors">
                  <Sparkles className="w-5 h-5 text-emerald-500 mb-2" />
                  <h3 className="text-xs font-semibold text-slate-900 mb-1">FortyGuard Intelligence</h3>
                  <p className="text-xs text-slate-500">Queries polygon microclimatic thermal scanning APIs directly.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
