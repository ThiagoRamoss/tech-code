'use client';

import { useState, useEffect } from 'react';

export default function SandboxPage() {
  const [code, setCode] = useState('// Digite seu código JavaScript (Node.js) aqui\\n\\nconsole.log("Olá, Mundo Vindo do Docker!");\\n');
  const [output, setOutput] = useState<string | null>(null);
  const [executing, setExecuting] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const runCode = async () => {
    setExecuting(true);
    setOutput(null);
    setExecutionTime(null);
    setJobId(null);

    try {
      // 1. Enviar código para a fila
      const res = await fetch('http://localhost:3333/test-sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, lang: 'javascript' })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar para fila.');
      
      setJobId(data.jobId);
    } catch (err: any) {
      setOutput(`Erro Crítico de Conexão: ${err.message}`);
      setExecuting(false);
    }
  };

  // 2. Polling para checar o status do Job no BullMQ
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkJobStatus = async () => {
      if (!jobId) return;

      try {
        const res = await fetch(`http://localhost:3333/sandbox/${jobId}`);
        const data = await res.json();

        if (data.state === 'completed') {
           setOutput(data.result?.saida || 'Execução bem sucedida sem saídas.');
           setExecutionTime(data.result?.tempoExecucaoMs || 0);
           setExecuting(false);
           clearInterval(interval);
        } else if (data.state === 'failed') {
           setOutput(data.result?.saida || data.failedReason || 'Falha na Execução.');
           setExecuting(false);
           clearInterval(interval);
        }
        // Se for 'waiting' ou 'active', continua o loop
      } catch (e) {
         setOutput('Erro de rede ao consultar fila.');
         setExecuting(false);
         clearInterval(interval);
      }
    };

    if (jobId && executing) {
      interval = setInterval(checkJobStatus, 1000);
    }

    return () => clearInterval(interval);
  }, [jobId, executing]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto h-full text-text-primary animate-fade-in pb-10">
      <header className="flex flex-col gap-2 border-b border-border-subtle/50 pb-6 relative">
        <div className="absolute -left-8 top-0 w-1 bg-purple-500 h-full rounded-r-md shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
        <h1 className="text-4xl font-black tracking-tight drop-shadow-sm">
          Laboratório <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Sandbox</span>
        </h1>
        <p className="text-base text-text-secondary mt-1 font-medium">
          Escreva seu código, execute-o remotamente e veja o motor de avaliação isolado em ação no Servidor.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
        {/* Editor Wrapper */}
        <div className="flex flex-col rounded-2xl bg-bg-panel/60 backdrop-blur-md border border-border-subtle shadow-2xl shadow-purple-500/5 overflow-hidden">
          <div className="bg-bg-element px-4 py-3 flex items-center justify-between border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                 <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z" opacity=".3"/><path d="M11 16h2v-2h-2v2zm0-9v5h2V7h-2zm4 9h2v-2h-2v2zm0-9v5h2V7h-2z" opacity=".3"/><path d="M11 7h2v5h-2zm4 0h2v5h-2zm-4 7h2v2h-2zm4 0h2v2h-2z" opacity=".3"/><path d="M15 16h2v-2h-2v2zm-4 0h2v-2h-2v2zm0-9v5h2V7h-2zM2.01 12C2.01 6.48 6.49 2 12 2s9.99 4.48 9.99 10-4.48 10-9.99 10-9.99-4.48-9.99-10zm17.97 0c0-4.41-3.59-8-8-8s-8 3.59-8 8 3.59 8 8 8 8-3.59 8-8zm-6-5h-2v5h2V7zm-4 0H8v5h2V7z"/><path d="M15 16h2v-2h-2v2zm-4 0h2v-2h-2v2z"/></svg> 
                 JavaScript (Node.js 20)
              </span>
            </div>
            <button 
              onClick={runCode}
              disabled={executing}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-1.5 px-4 rounded-lg transition-colors flex items-center gap-2 text-sm shadow-lg shadow-purple-500/20 disabled:opacity-50"
            >
              {executing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submetendo...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Executar Código
                </>
              )}
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full bg-[#1e1e1e] text-[#d4d4d4] p-4 font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-inset focus:ring-purple-500/50"
          />
        </div>

        {/* Console / Output Wrapper */}
        <div className="flex flex-col rounded-2xl bg-[#0d0d0d] border border-border-strong overflow-hidden relative group shadow-2xl">
           <div className="bg-bg-element px-4 py-3 flex items-center justify-between border-b border-border-strong">
             <span className="text-xs font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
               <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               Terminal Output
             </span>
             {executionTime !== null && (
               <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                 Tempo: {executionTime}ms
               </span>
             )}
           </div>
           
           <div className="flex-1 p-4 font-mono text-sm relative overflow-y-auto">
             {executing && !output && (
               <div className="flex flex-col gap-2 relative z-10 opacity-70">
                 <div className="text-purple-400 flex items-center gap-2 font-semibold">
                   Container Docker em inicialização...
                 </div>
                 <div className="w-full bg-border-strong h-1 rounded-full overflow-hidden mt-2">
                    <div className="bg-purple-500 h-full animate-pulse w-full"></div>
                 </div>
               </div>
             )}
             
             {!executing && !output && (
               <div className="h-full flex flex-col items-center justify-center text-text-secondary/50">
                 <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 O resultado da execução aparecerá aqui.
               </div>
             )}

             {output && (
               <pre className={`whitespace-pre-wrap ${output.includes('❌ Erro') || output.includes('Falha') || output.includes('ReferenceError') || output.includes('SyntaxError') ? 'text-red-400' : 'text-emerald-400'} leading-relaxed relative z-10`}>
                 {output}
               </pre>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
