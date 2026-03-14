interface Content {
  id: string;
  title: string;
  body: string;
  type?: string;
}

export default async function ContentsPage() {
  let contents: Content[] = [];
  let errorMsg = '';

  try {
    const res = await fetch('http://localhost:3333/contents', { cache: 'no-store' });
    if (!res.ok) throw new Error('API Offline');
    contents = await res.json();
  } catch (error) {
    console.error("TechCode Fetch Error:", error);
    errorMsg = 'Navegação indisponível. Conexão com o Servidor recusada.';
  }

  return (
    <div className="flex flex-col gap-10 w-full max-w-5xl mx-auto h-full text-text-primary transition-colors animate-fade-in">
      <header className="flex flex-col gap-2 border-b border-border-subtle/50 pb-6 relative">
        <div className="absolute -left-8 top-0 w-1 bg-brand-500 h-full rounded-r-md"></div>
        <h1 className="text-4xl font-black tracking-tight drop-shadow-sm">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">Conteúdos</span> Abertos
        </h1>
        <p className="text-base text-text-secondary mt-1 font-medium">
          Explore a biblioteca oficial de materiais teóricos e práticos de Engenharia de Software.
        </p>
      </header>

      {errorMsg ? (
        <section className="flex-1 rounded-3xl bg-red-500/10 backdrop-blur-md border border-red-500/30 shadow-lg shadow-red-500/5 flex flex-col items-center justify-center p-16 text-center transition-all duration-500 relative overflow-hidden group">
            <h3 className="text-2xl font-bold mb-3 text-red-400">Conexão Indisponível</h3>
            <p className="text-red-300 max-w-md leading-relaxed font-medium">
               O serviço de Backend não está respondendo. Verifique o status da porta e o log do servidor Node.js.
            </p>
        </section>
      ) : contents.length === 0 ? (
        <section className="flex-1 rounded-3xl bg-bg-panel/40 backdrop-blur-md border border-border-subtle hover:border-brand-500/30 shadow-lg shadow-brand-500/5 flex flex-col items-center justify-center p-16 text-center transition-all duration-500 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0,transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="w-20 h-20 relative mb-6">
            <div className="absolute inset-0 bg-brand-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
            <div className="w-full h-full relative z-10 rounded-2xl bg-bg-base border border-brand-500/30 flex items-center justify-center text-brand-500 shadow-xl group-hover:-translate-y-2 group-hover:shadow-[0_10px_25px_rgba(59,130,246,0.2)] transition-all duration-500">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-3 group-hover:text-brand-400 transition-colors">Acervo Indisponível</h3>
          <p className="text-text-secondary max-w-md leading-relaxed font-medium">
             Nenhum material de estudo foi encontrado na base de dados conectada.
          </p>
        </section>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {contents.map((item) => (
             <article key={item.id} className="relative group rounded-3xl bg-bg-panel/40 backdrop-blur-md border border-border-subtle hover:border-brand-500/50 p-8 flex flex-col transition-all duration-500 cursor-pointer overflow-hidden shadow-lg hover:shadow-brand-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <h3 className="text-2xl font-bold text-text-primary mb-3 relative z-10 transition-colors group-hover:text-brand-500">
                  {item.title}
                </h3>
                <p className="text-text-secondary relative z-10 line-clamp-4 leading-relaxed font-medium">
                  {item.body}
                </p>
                <div className="mt-6 pt-4 border-t border-border-subtle/50 relative z-10">
                   <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">{item.type || 'Artigo Oficial'}</span>
                </div>
             </article>
          ))}
        </div>
      )}
    </div>
  );
}
