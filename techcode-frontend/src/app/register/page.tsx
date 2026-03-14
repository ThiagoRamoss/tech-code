'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Cadastrar Usuário
      const res = await fetch('http://localhost:3333/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Falha ao criar credencial.');
      }

      // 2. Com a conta criada, fazemos login automático
      const loginRes = await fetch('http://localhost:3333/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const loginData = await loginRes.json();

      if (loginRes.ok && loginData.token) {
        localStorage.setItem('techcode-token', loginData.token);
        localStorage.setItem('techcode-user', JSON.stringify(loginData.user));

        // 3. Cadastrar ID Card Automático (Inicial) no Backend usando o Bearer!
        await fetch('http://localhost:3333/idcards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.token}`
          },
          body: JSON.stringify({
            userId: loginData.user.id,
            nickname: name.split(' ')[0] + Math.floor(Math.random() * 100),
            experience: 0,
            level: 1
          })
        });

        window.location.href = '/';
      } else {
        window.location.href = '/login';
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in my-auto relative z-20">

      <div className="relative group rounded-[2rem] bg-bg-panel/60 backdrop-blur-xl border border-border-subtle p-10 flex flex-col shadow-2xl shadow-emerald-500/10 transition-all duration-500 overflow-hidden">
        {/* Glow Superior Esmeralda */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-emerald-500/20 blur-3xl rounded-full"></div>

        <div className="text-center mb-8 relative z-10 pt-4">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 tracking-tight">Criação de Conta</h1>
          <p className="text-text-secondary mt-2 text-sm font-medium">Cadastre-se para acessar o TechCode.</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold rounded-xl text-center backdrop-blur-sm animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4 relative z-10">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider ml-1">Nome Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-bg-base/50 border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              placeholder="Ex: Alan Turing"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider ml-1">Endereço de E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-base/50 border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              placeholder="seu.nome@exemplo.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider ml-1">Senha (Mínimo 6)</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg-base/50 border border-border-subtle rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-400/50"
          >
            {loading ? 'Processando Cadastro...' : 'Confirmar Cadastro'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-text-secondary font-medium relative z-10">
          Já possui uma conta ativa?{' '}
          <Link href="/login" className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors">
            Fazer Login
          </Link>
        </p>
      </div>
    </div>
  );
}
