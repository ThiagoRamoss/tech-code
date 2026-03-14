'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect, useState } from 'react';

export function Sidebar() {
  const menuItems = [
    {
      name: 'Conteúdos',
      href: '/contents',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      name: 'Roadmap',
      href: '/roadmap',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    },
    {
      name: 'Repositório Pessoal',
      href: '/idcard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      )
    },
    {
      name: 'Laboratório Sandbox',
      href: '/sandbox',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      name: 'Glossário',
      href: '/glossary',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      )
    },
  ];

  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('techcode-user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name);
        
        // Extrair iniciais
        const words = user.name.split(' ');
        const initials = words.length > 1 
          ? words[0][0] + words[words.length - 1][0]
          : words[0].slice(0, 2);
        
        setUserInitials(initials.toUpperCase());
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('techcode-token');
    localStorage.removeItem('techcode-user');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 z-50 h-screen max-w-xs fixed left-0 top-0 bg-bg-panel/80 backdrop-blur-xl border-r border-border-subtle flex flex-col transition-all duration-300 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.3)]">
      {/* Platform Logo App */}
      <div className="h-24 flex items-center justify-center border-b border-border-subtle/50 relative overflow-hidden group">
        <Link href="/">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-500/0 via-brand-500/10 to-brand-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
          <h1 className="text-3xl font-black tracking-tighter text-text-primary relative z-10 drop-shadow-sm cursor-pointer hover:scale-105 transition-transform">
            Tech<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">Code</span>
          </h1>
        </Link>
      </div>

      {/* Main Strict Navigation */}
      <nav className="flex-1 py-8 px-5 flex flex-col gap-2 relative overflow-y-auto">
        <p className="px-3 text-[10px] font-bold text-text-secondary/70 uppercase tracking-widest mb-3">
          Aprendizado Principal
        </p>

        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-text-secondary hover:text-text-primary hover:bg-gradient-to-r hover:from-brand-500/10 hover:to-transparent hover:border-l-2 hover:border-brand-500 border-l-2 border-transparent transition-all duration-300 group relative"
          >
            <div className="text-brand-500 opacity-70 group-hover:opacity-100 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all duration-300">
              {item.icon}
            </div>
            <span className="font-semibold tracking-wide">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border-subtle/50 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-brand-500/20 to-transparent"></div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 dark:hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center font-bold text-white shadow-lg shadow-brand-500/30 group-hover:shadow-brand-500/50 group-hover:scale-105 transition-all duration-300 border border-white/20">
                {userInitials || 'US'}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-text-primary leading-tight truncate w-full">{userName || 'Usuário'}</span>
                <span className="text-[10px] font-medium text-brand-500 flex items-center gap-1">
                  Online <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                </span>
              </div>
            </div>
            <ThemeToggle />
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair da Plataforma
          </button>
        </div>
      </div>
    </aside>
  );
}
