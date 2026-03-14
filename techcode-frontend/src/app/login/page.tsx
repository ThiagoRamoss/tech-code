'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3333/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Autenticação falhou.');
      }

      // Salva o token localmente
      localStorage.setItem('techcode-token', data.token);
      localStorage.setItem('techcode-user', JSON.stringify(data.user));

      // Redireciona via Browser Push para recarregar com Auth
      window.location.href = '/';
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in my-auto relative z-20">
      
      {/* Container Principal Glassmorphism */}
      <div className="relative group rounded-[2rem] bg-bg-panel/60 backdrop-blur-xl border border-border-subtle p-10 flex flex-col shadow-2xl shadow-brand-500/10 transition-all duration-500 overflow-hidden">
        {/* Glow Superior */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-brand-500/20 blur-3xl rounded-full"></div>

        <div className="flex justify-center mb-8 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-black text-3xl text-white shadow-xl shadow-brand-500/30 border border-brand-400">
             TC
          </div>
        </div>

        <div className="text-center mb-10 relative z-10">
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Portal de Acesso</h1>
          <p className="text-text-secondary mt-2 text-sm font-medium">Insira suas credenciais para prosseguir.</p>
        </div>

        {error && (
           <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold rounded-xl text-center backdrop-blur-sm animate-pulse">
              {error}
           </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5 relative z-10">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider ml-1">Endereço de E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-base/50 border border-border-subtle rounded-xl px-4 py-3.5 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
              placeholder="seu.nome@exemplo.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider ml-1">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-base/50 border border-border-subtle rounded-xl px-4 py-3.5 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
             type="submit" 
             disabled={loading}
             className="mt-4 w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
             {loading ? 'Autenticando...' : 'Entrar na Plataforma'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-secondary font-medium relative z-10">
          Ainda não possui uma conta?{' '}
          <Link href="/register" className="text-brand-500 hover:text-brand-400 font-bold transition-colors">
            Registrar-se agora
          </Link>
        </p>
      </div>
    </div>
  );
}
