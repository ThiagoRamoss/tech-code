'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [idCard, setIdCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdCard = async () => {
      const userStr = localStorage.getItem('techcode-user');
      const token = localStorage.getItem('techcode-token');
      
      if (userStr && token) {
        try {
          const user = JSON.parse(userStr);
          setUserName(user.name);
          setUserId(user.id);
          
          // Busca o ID Card do usuário logado
          const res = await fetch(`http://localhost:3333/idcards`, {
             headers: {
               'Authorization': `Bearer ${token}`
             }
          });
          
          if (res.ok) {
            const data = await res.json();
            // Assumimos que a rota index retorna todos, então filtramos pelo nosso ID
            const myCard = data.find((c: any) => c.userId === user.id);
            setIdCard(myCard || { level: 1, experience: 0, nickname: user.name.split(' ')[0] });
          }
        } catch (e) {
          console.error("Erro ao buscar dados do usuário", e);
        }
      }
      setLoading(false);
    };

    fetchIdCard();
  }, []);

  return (
    <div className="flex flex-col gap-10 h-full w-full max-w-5xl mx-auto pt-6 animate-fade-in">
      <header className="flex flex-col gap-4 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold w-fit mb-2 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </span>
          Painel do Aluno
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl transition-colors leading-tight">
          Bem-vindo de volta,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-500 to-indigo-500 filter drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            {userName ? userName.split(' ')[0] : 'Engenheiro'}.
          </span>
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mt-2 transition-colors font-medium leading-relaxed">
          Selecione uma das trilhas no painel lateral e avance no desenvolvimento das suas habilidades de engenharia.
        </p>
      </header>

      {/* ID Card Resumo */}
      {!loading && idCard && (
        <div className="relative group rounded-3xl bg-gradient-to-br from-bg-panel/60 to-bg-panel/30 backdrop-blur-xl border border-border-subtle p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-brand-500/5 transition-all">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-3xl rounded-full"></div>
          
          <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center font-bold text-white shadow-lg shadow-brand-500/30 text-3xl border-4 border-bg-base">
            {idCard.level}
          </div>

          <div className="relative z-10 flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h3 className="text-xl font-bold text-text-primary">Módulo Principal</h3>
                <p className="text-sm text-text-secondary font-medium uppercase tracking-wide">Nível de Experiência</p>
              </div>
              <span className="text-sm font-bold text-brand-500">{idCard.experience} / {idCard.level * 100} XP</span>
            </div>
            
            <div className="w-full h-3 bg-bg-base/80 rounded-full overflow-hidden border border-border-subtle/50">
               <div 
                 className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)] transition-all duration-1000 ease-out"
                 style={{ width: `${Math.min((idCard.experience / (idCard.level * 100)) * 100, 100)}%` }}
               ></div>
            </div>
          </div>
          
          <Link href="/idcard" className="relative z-10 whitespace-nowrap px-6 py-3 bg-bg-element/80 hover:bg-brand-500/10 text-brand-500 font-bold rounded-xl border border-border-subtle hover:border-brand-500/30 transition-all text-sm">
            Ver Perfil Completo
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
        {/* Card 1: Conteúdos */}
        <Link href="/contents" className="relative group rounded-3xl bg-bg-panel/40 backdrop-blur-md border border-border-subtle hover:border-brand-500/50 p-8 transition-all duration-500 cursor-pointer overflow-hidden shadow-lg hover:shadow-brand-500/10 block">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/20 blur-3xl rounded-full group-hover:bg-brand-500/30 transition-colors duration-500"></div>
          
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 border border-brand-500/20 flex items-center justify-center mb-6 text-brand-500 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-text-primary mb-3 relative z-10 transition-colors group-hover:text-brand-500">
            Conteúdos Teóricos &rarr;
          </h3>
          <p className="text-text-secondary relative z-10 transition-colors leading-relaxed">
            Mergulhe profundamente nas literaturas essenciais, fundamentações de infraestrutura e engenharia de software pura.
          </p>
        </Link>

        {/* Card 2: Roadmaps */}
        <Link href="/roadmap" className="relative group rounded-3xl bg-bg-panel/40 backdrop-blur-md border border-border-subtle hover:border-indigo-500/50 p-8 transition-all duration-500 cursor-pointer overflow-hidden shadow-lg hover:shadow-indigo-500/10 block">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/30 transition-colors duration-500"></div>
          
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-6 text-indigo-500 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-text-primary mb-3 relative z-10 transition-colors group-hover:text-indigo-500">
            Roadmaps Práticos &rarr;
          </h3>
          <p className="text-text-secondary relative z-10 transition-colors leading-relaxed">
            Consolide seus conhecimentos avançando por trilhas estruturadas focadas nas ferramentas de mercado.
          </p>
        </Link>
      </div>
    </div>
  );
}
