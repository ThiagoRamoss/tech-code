interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
}

export default async function GlossaryPage() {
  let dictionary: GlossaryTerm[] = [];
  let errorMsg = '';

  try {
    const res = await fetch('http://localhost:3333/glossary', { cache: 'no-store' });
    if (!res.ok) throw new Error('API Offline');
    dictionary = await res.json();
  } catch (error) {
    console.error("TechCode Fetch Error:", error);
    errorMsg = 'Navegação indisponível. Conexão com o Servidor recusada.';
  }

  return (
    <div className="flex flex-col gap-10 w-full max-w-5xl mx-auto h-full text-text-primary transition-colors animate-fade-in">
      <header className="flex flex-col gap-2 border-b border-border-subtle/50 pb-6 relative">
        <div className="absolute -left-8 top-0 w-1 bg-emerald-500 h-full rounded-r-md"></div>
        <h1 className="text-4xl font-black tracking-tight drop-shadow-sm">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Glossário</span> Técnico
        </h1>
        <p className="text-base text-text-secondary mt-1 font-medium">
          Repositório conceitual para padronização de terminologias de Engenharia e Arquitetura.
        </p>
      </header>

      {errorMsg ? (
        <section className="flex-1 rounded-3xl bg-red-500/10 backdrop-blur-md border border-red-500/30 shadow-lg shadow-red-500/5 flex flex-col items-center justify-center p-16 text-center transition-all duration-500 relative overflow-hidden group">
            <h3 className="text-2xl font-bold mb-3 text-red-400">Conexão Indisponível</h3>
            <p className="text-red-300 max-w-md leading-relaxed font-medium">
               Microsserviço de listagem injetável encontra-se sem conectividade.
            </p>
        </section>
      ) : dictionary.length === 0 ? (
        <section className="flex-1 rounded-3xl bg-bg-panel/40 backdrop-blur-md border border-border-subtle hover:border-emerald-500/30 shadow-lg shadow-emerald-500/5 flex flex-col items-center justify-center p-16 text-center transition-all duration-500 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0,transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="w-20 h-20 relative mb-6">
            <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
            <div className="w-full h-full relative z-10 rounded-2xl bg-bg-base border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-xl group-hover:-translate-y-2 group-hover:shadow-[0_10px_25px_rgba(16,185,129,0.2)] transition-all duration-500">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-3 group-hover:text-emerald-400 transition-colors">Nenhum Termo Cadastrado</h3>
          <p className="text-text-secondary max-w-md leading-relaxed font-medium">
             Não foi possível recuperar a listagem vocabular do banco de dados na inicialização.
          </p>
        </section>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {dictionary.map((dictInfo) => (
             <div key={dictInfo.id} className="relative group rounded-2xl bg-bg-panel/40 backdrop-blur-sm border border-border-subtle hover:border-emerald-500/40 p-6 flex flex-col hover:-translate-y-1 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                   <span className="font-bold text-lg">{dictInfo.term.charAt(0).toUpperCase()}</span>
                </div>
                <h4 className="text-xl font-bold text-text-primary mb-2 min-h-[56px] flex items-center">{dictInfo.term}</h4>
                <p className="text-sm text-text-secondary leading-relaxed flex-1">
                  {dictInfo.definition}
                </p>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
