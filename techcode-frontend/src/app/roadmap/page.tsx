interface Roadmap {
  id: string;
  title: string;
  description: string;
  level?: string;
}

export default async function RoadmapPage() {
  let roadmaps: Roadmap[] = [];
  let errorMsg = '';

  try {
    // Como usamos o Next.js App Router, podemos fazer chamadas na porta nativa Server-Side!
    // Usamos 'no-store' para garantir que os dados do Redis/DB não fiquem mofados no cache do Browser.
    const res = await fetch('http://localhost:3333/roadmaps', { cache: 'no-store' });
    
    if (!res.ok) {
        throw new Error('Falha ao recuperar as integrações do microsserviço.');
    }
    
    roadmaps = await res.json();
  } catch (error: any) {
    console.error("TechCode Server Offline ou Erro de Fetch:", error);
    errorMsg = 'Navegação indisponível. Conexão com o Servidor recusada.';
  }

  return (
    <div className="flex flex-col gap-10 w-full max-w-5xl mx-auto h-full text-text-primary transition-colors animate-fade-in">
      <header className="flex flex-col gap-2 border-b border-border-subtle/50 pb-6 relative">
        <div className="absolute -left-8 top-0 w-1 bg-indigo-500 h-full rounded-r-md"></div>
        <h1 className="text-4xl font-black tracking-tight drop-shadow-sm">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Roadmaps</span> Práticos
        </h1>
        <p className="text-base text-text-secondary mt-1 font-medium">
          Acompanhe as trilhas estruturadas de desenvolvimento e acelere sua capacitação técnica.
        </p>
      </header>

      {/* Area de Exibição Dinâmica do Backend Node.js */}
      {errorMsg ? (
        <section className="flex-1 rounded-3xl bg-red-500/10 backdrop-blur-md border border-red-500/30 shadow-lg shadow-red-500/5 flex flex-col items-center justify-center p-16 text-center transition-all duration-500 relative overflow-hidden group">
            <h3 className="text-2xl font-bold mb-3 text-red-400">Conexão Indisponível</h3>
            <p className="text-red-300 max-w-md leading-relaxed font-medium">
               O serviço de Backend não está respondendo. Verifique a telemetria e o console da API.
            </p>
        </section>
      ) : roadmaps.length === 0 ? (
        <section className="flex-1 rounded-3xl bg-bg-panel/40 backdrop-blur-md border border-border-subtle hover:border-indigo-500/30 shadow-lg shadow-indigo-500/5 flex flex-col items-center justify-center p-16 text-center transition-all duration-500 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0,transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="w-20 h-20 relative mb-6">
            <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
            <div className="w-full h-full relative z-10 rounded-2xl bg-bg-base border border-indigo-500/30 flex items-center justify-center text-indigo-500 shadow-xl group-hover:-translate-y-2 group-hover:shadow-[0_10px_25px_rgba(99,102,241,0.2)] transition-all duration-500">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">Nenhum Mapa Cadastrado</h3>
          <p className="text-text-secondary max-w-md leading-relaxed font-medium">
             Sistema não localizou Roadmaps ativos no cache do módulo ou no banco primário.
          </p>
        </section>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((mapNode) => (
            <div key={mapNode.id} className="relative group rounded-3xl bg-bg-panel/40 backdrop-blur-md border border-border-subtle hover:border-indigo-500/50 p-6 flex flex-col items-start transition-all duration-500 cursor-pointer overflow-hidden shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-500 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-text-primary mb-2 relative z-10 transition-colors group-hover:text-indigo-400">
                {mapNode.title}
              </h3>
              <p className="text-sm text-text-secondary relative z-10 line-clamp-3 mb-4 flex-1">
                {mapNode.description}
              </p>

              <div className="flex items-center justify-between w-full border-t border-border-subtle/50 pt-4 mt-auto">
                <span className="text-xs font-bold text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                  {mapNode.level || 'Novato'}
                </span>
                <span className="text-text-secondary text-sm font-medium flex items-center gap-1 group-hover:text-indigo-400 transition-colors">
                  Acessar Trilha &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
