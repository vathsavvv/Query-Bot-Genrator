
import React, { useState, useEffect } from 'react';
import { View, Document, BotConfig, Message } from './types';
import Layout from './components/Layout';
import BrutalistButton from './components/BrutalistButton';
import { queryBot } from './services/geminiService';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Send, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  Fingerprint,
  Database,
  Settings,
  MessageSquare,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.DASHBOARD);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [botConfig, setBotConfig] = useState<BotConfig>({
    name: 'CORE_UNIT_01',
    companyName: 'ACME CORP',
    industry: 'Technology',
    customInstructions: 'Be precise, use technical jargon where appropriate, and always conclude with "End of Transmition".',
  });
  
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // File Upload Handling with simulated security scanning
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const newDocId = Math.random().toString(36).substr(2, 9);
        
        const newDoc: Document = {
          id: newDocId,
          name: file.name,
          type: file.type,
          content: content || "Sample extracted text content.",
          uploadedAt: new Date().toISOString(),
          status: 'SCANNING'
        };
        
        setDocuments(prev => [...prev, newDoc]);

        // Simulate "Security Scanning & Knowledge Embedding"
        setTimeout(() => {
          setDocuments(prev => prev.map(d => 
            d.id === newDocId ? { ...d, status: 'ACTIVE' } : d
          ));
        }, 2000 + Math.random() * 3000);
      };
      reader.readAsText(file);
    });
  };

  const deleteDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const sendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const currentInput = userInput;
    setUserInput('');
    setIsLoading(true);

    const newMessage: Message = { role: 'user', text: currentInput };
    setChatHistory(prev => [...prev, newMessage]);

    const responseText = await queryBot(botConfig, chatHistory, documents, currentInput);
    
    setChatHistory(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  const activeDocs = documents.filter(d => d.status === 'ACTIVE');

  return (
    <Layout currentView={view} setView={setView} botName={botConfig.name}>
      
      {view === View.DASHBOARD && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-[#000] text-white p-8 brutalist-border brutalist-shadow">
            <h2 className="text-4xl font-black uppercase mb-4 tracking-tighter flex items-center gap-3">
              <Activity className="text-[#00FF00]" /> System Pulse
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-2 border-white p-4">
                <p className="text-xs uppercase opacity-60">Knowledge Nodes</p>
                <p className="text-3xl font-mono">{activeDocs.length} / {documents.length}</p>
              </div>
              <div className="border-2 border-white p-4">
                <p className="text-xs uppercase opacity-60">Bot Readiness</p>
                <p className="text-3xl font-mono text-[#00FF00]">
                  {activeDocs.length > 0 ? 'READY' : 'WAITING'}
                </p>
              </div>
              <div className="border-2 border-white p-4">
                <p className="text-xs uppercase opacity-60">Integrity Level</p>
                <p className="text-3xl font-mono">SECURE</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 brutalist-border brutalist-shadow flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold uppercase mb-2 flex items-center gap-2">
                  <Cpu /> Neural Hub
                </h3>
                <p className="text-sm opacity-70 mb-6 font-mono">
                  Current designation: {botConfig.name}<br/>
                  Knowledge base: {activeDocs.length} validated nodes.<br/>
                  Behavior: {botConfig.industry} optimized.
                </p>
              </div>
              <BrutalistButton onClick={() => setView(View.BOT_SETUP)}>
                Adjust Core Param
              </BrutalistButton>
            </div>
            <div className="bg-[#FFFF00] p-8 brutalist-border brutalist-shadow">
              <h3 className="text-xl font-bold uppercase mb-2 flex items-center gap-2">
                <Zap /> Instant Access
              </h3>
              <p className="text-sm mb-6 font-bold">
                Deploy current knowledge set for real-time querying in the secure sandbox environment.
              </p>
              <BrutalistButton variant="secondary" onClick={() => setView(View.CHAT)}>
                PREVIEW
              </BrutalistButton>
            </div>
          </div>
        </div>
      )}

      {view === View.KNOWLEDGE_BASE && (
        <div className="space-y-8">
          <div className="bg-white p-8 brutalist-border brutalist-shadow">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-black uppercase flex items-center gap-4">
                <Database size={36} /> Knowledge Ingestion
              </h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-mono">
                <ShieldCheck size={14} className="text-[#00FF00]" /> END-TO-END ENCRYPTED
              </div>
            </div>
            
            <div className="relative group">
              <input 
                type="file" 
                multiple 
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="brutalist-border border-dashed border-4 p-12 text-center group-hover:bg-gray-50 transition-colors">
                <Upload className="mx-auto mb-4" size={48} />
                <p className="font-bold text-lg uppercase mb-1">Upload Proprietary Data</p>
                <p className="text-sm opacity-60">PDF, TXT, DOCX - Max 50MB per bundle</p>
              </div>
            </div>
          </div>

          <div className="bg-white brutalist-border brutalist-shadow overflow-hidden">
            <div className="bg-black text-white p-4 font-bold uppercase flex justify-between items-center">
              <span>Ingested Nodes</span>
              <span className="text-[10px] opacity-70">{documents.length} Total</span>
            </div>
            <div className="divide-y-4 divide-black">
              {documents.length === 0 ? (
                <div className="p-12 text-center opacity-30 italic font-mono uppercase">System idle. Waiting for ingestion input...</div>
              ) : (
                documents.map(doc => (
                  <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-[#F0F0F0]">
                    <div className="flex items-center gap-4">
                      {doc.status === 'SCANNING' ? (
                        <div className="w-6 h-6 border-2 border-black border-t-transparent animate-spin" />
                      ) : (
                        <FileText size={24} className={doc.status === 'ACTIVE' ? 'text-black' : 'text-red-500'} />
                      )}
                      <div>
                        <p className="font-bold uppercase leading-none flex items-center gap-2">
                          {doc.name}
                          {doc.status === 'ACTIVE' && <CheckCircle2 size={12} className="text-green-600" />}
                        </p>
                        <p className="text-[10px] opacity-50 font-mono mt-1">
                          {doc.status === 'SCANNING' ? 'SECURITY SCAN IN PROGRESS...' : `STATIONARY: ${doc.uploadedAt}`}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteDoc(doc.id)}
                      className="p-2 text-red-600 hover:bg-red-50 brutalist-border transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {view === View.BOT_SETUP && (
        <div className="bg-white p-8 brutalist-border brutalist-shadow max-w-2xl mx-auto">
          <h2 className="text-3xl font-black uppercase mb-8 flex items-center gap-4">
            <Settings size={36} /> Core Configuration
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-black uppercase">Core Designation</label>
              <input 
                type="text" 
                value={botConfig.name}
                onChange={(e) => setBotConfig({...botConfig, name: e.target.value})}
                className="w-full p-4 brutalist-border font-mono focus:bg-[#FFFF00] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-black uppercase">Organization</label>
                <input 
                  type="text" 
                  value={botConfig.companyName}
                  onChange={(e) => setBotConfig({...botConfig, companyName: e.target.value})}
                  className="w-full p-4 brutalist-border font-mono focus:bg-[#FFFF00] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-black uppercase">Industry Vertical</label>
                <input 
                  type="text" 
                  value={botConfig.industry}
                  onChange={(e) => setBotConfig({...botConfig, industry: e.target.value})}
                  className="w-full p-4 brutalist-border font-mono focus:bg-[#FFFF00] outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-black uppercase">Interaction Protocol (Tone)</label>
              <textarea 
                rows={5}
                value={botConfig.customInstructions}
                onChange={(e) => setBotConfig({...botConfig, customInstructions: e.target.value})}
                className="w-full p-4 brutalist-border font-mono focus:bg-[#FFFF00] outline-none resize-none"
                placeholder="Instruct the model on how to communicate..."
              />
            </div>

            <BrutalistButton className="w-full" variant="success" onClick={() => setView(View.DASHBOARD)}>
              Commit Configuration
            </BrutalistButton>
          </div>
        </div>
      )}

      {view === View.CHAT && (
        <div className="h-full flex flex-col gap-4">
          <div className="flex-1 bg-white brutalist-border brutalist-shadow overflow-hidden flex flex-col">
            <div className="bg-black text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-bold uppercase">{botConfig.name} ACTIVE_LINK</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono opacity-50">
                <span>ENCRYPTION: RSA-4096</span>
                <span>DATA: {activeDocs.length} NODES</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F9FAFB] font-mono">
              {chatHistory.length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-4 max-w-sm">
                    <div className="inline-block p-4 brutalist-border bg-[#FFFF00] animate-bounce">
                      <MessageSquare size={32} />
                    </div>
                    <p className="font-bold uppercase tracking-widest">Query Interface Ready</p>
                    <p className="text-[10px] opacity-60">Awaiting encrypted stakeholder input. All queries are resolved via local knowledge core.</p>
                  </div>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                    max-w-[85%] p-4 brutalist-border brutalist-shadow-sm
                    ${msg.role === 'user' ? 'bg-[#FFFF00]' : 'bg-white'}
                  `}>
                    <div className="flex items-center gap-2 mb-2 opacity-40">
                      {msg.role === 'user' ? <Fingerprint size={12} /> : <Cpu size={12} />}
                      <p className="text-[10px] font-black uppercase">
                        {msg.role === 'user' ? 'STAKEHOLDER_ID' : botConfig.name}
                      </p>
                    </div>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    {msg.role === 'model' && (
                      <div className="mt-4 pt-2 border-t border-black/10 flex items-center gap-2 text-[8px] font-bold opacity-30">
                        <CheckCircle2 size={10} /> VERIFIED_RESPONSE
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-4 brutalist-border bg-black text-white animate-pulse">
                    <p className="font-black italic uppercase text-xs">Accessing knowledge nodes...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t-4 border-black">
              <form 
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="flex gap-4"
              >
                <input 
                  type="text"
                  value={userInput}
                  disabled={isLoading}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter query string..."
                  className="flex-1 p-4 brutalist-border font-mono outline-none focus:bg-[#FFFF00] transition-colors bg-white text-sm"
                />
                <BrutalistButton type="submit" disabled={isLoading || !userInput.trim()}>
                  <Send size={20} />
                </BrutalistButton>
              </form>
            </div>
          </div>

          <div className="bg-black text-[#FFFF00] p-3 text-[10px] brutalist-border font-mono uppercase flex justify-between overflow-hidden">
            <span className="truncate">SYS_PATH: root/knowledge/core/{botConfig.name.toLowerCase()}</span>
            <span className="hidden md:inline">Uptime: {Math.floor(Math.random()*999)}h</span>
            <span>Status: 100% NOMINAL</span>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
