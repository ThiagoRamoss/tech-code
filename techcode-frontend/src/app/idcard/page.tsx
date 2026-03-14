interface IdCard {
  id: string;
  userId: string;
  rank: string;
  xp: number;
}

export default async function IdCardPage() {
  let cards: IdCard[] = [];
  let errorMsg = '';

  try {
    const res = await fetch('http://localhost:3333/idcards', { cache: 'no-store' });
    if (!res.ok) throw new Error('API IDCards Offline');
    cards = await res.json();
  } catch (error) {
    console.error("TechCode Fetch Error:", error);
    errorMsg = 'Servidor mestre indisponível.';
  }

  // Se não existir, criamos um mock visual temporário pro front.
  const myCard = cards.length > 0 ? cards[0] : {
    rank: 'Iniciante',
    xp: 0
  };

  return (
    <div className="flex flex-col gap-10 w-full max-w-5xl mx-auto h-full text-text-primary transition-colors animate-fade-in">
      <header className="flex flex-col gap-2 border-b border-border-subtle/50 pb-6 relative">
        <div className="absolute -left-8 top-0 w-1 bg-brand-500 h-full rounded-r-md"></div>
        <h1 className="text-4xl font-black tracking-tight drop-shadow-sm">
          Meu <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">Perfil Profissional</span>
        </h1>
        <p className="text-base text-text-secondary mt-1 font-medium">
          Acompanhe o seu progresso no aprendizado técnico e as suas realizações na plataforma.
        </p>
      </header>

      {errorMsg && (
         <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm font-semibold flex items-center justify-center">
            Módulo de Perfil offline. Verifique a integração com o Backend.
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Painel do Currículo (Antes ID Card Gamer) */}
        <div className="md:col-span-1 relative group rounded-3xl bg-bg-panel/60 backdrop-blur-md border border-border-subtle p-8 flex flex-col items-center shadow-xl shadow-brand-500/5 hover:border-brand-500/30 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-brand-500 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
            <div className="w-28 h-28 relative z-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center font-black text-4xl text-white shadow-2xl shadow-brand-500/30 border-4 border-bg-base ring-4 ring-brand-500/20 group-hover:scale-105 transition-transform duration-500">
              TS
            </div>
            {/* Tag Qualificação Dinâmica */}
            <div className="absolute -bottom-2 lg:-bottom-3 left-1/2 -translate-x-1/2 bg-bg-base border border-brand-500/50 text-brand-500 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap z-20 shadow-md">
              Nível {Math.floor(myCard.xp / 100) || 1}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-secondary mt-2">Thiago Ramos</h2>
          <span className="text-brand-500 font-semibold mb-6 flex items-center gap-2">
            Engenheiro de Software <span className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
          </span>

          <div className="w-full relative">
            <div className="w-full bg-bg-base/80 rounded-full h-4 mb-2 border border-border-subtle overflow-hidden relative shadow-inner">
              <div className="absolute top-0 left-0 bg-gradient-to-r from-brand-600 to-brand-400 h-full rounded-full relative" style={{ width: `${Math.min(myCard.xp % 100, 100)}%` }}>
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <div className="w-full flex justify-between text-xs font-semibold text-text-secondary mt-2">
              <span className="text-brand-500 drop-shadow-[0_0_2px_rgba(59,130,246,0.3)]">{myCard.xp} XP</span>
              <span>{(Math.floor(myCard.xp / 100) + 1) * 100} XP</span>
            </div>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="md:col-span-2 relative group rounded-3xl bg-bg-panel/30 backdrop-blur-sm border-2 border-dashed border-border-strong/50 hover:border-brand-500/40 p-12 flex flex-col items-center justify-center text-center h-full min-h-[350px] transition-all duration-500">
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 dark:opacity-10 mask-image-radial-gradient"></div>
           <svg className="w-12 h-12 text-border-strong mb-4 group-hover:text-brand-500/50 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
           </svg>
           <h3 className="text-xl font-bold mb-2">Conquistas e Certificações</h3>
           <p className="text-text-secondary max-w-sm">
             {cards.length === 0 ? "Utilize a plataforma para inicializar o seu perfil localmente." : "O seu histórico de avaliações técnicas e certificações aparecerá aqui em breve."}
           </p>
        </div>

      </div>
    </div>
  );
}
