'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { useEffect, useState } from 'react';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  // Ocultar a estrutura Master em páginas de Autenticação
  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const token = localStorage.getItem('techcode-token');
    
    // Se tentar acessar o app sem token, expulsa
    if (!token && !isAuthPage) {
       window.location.href = '/login';
    }
    // Se já estiver logado, não precisa ver tela de login
    else if (token && isAuthPage) {
       window.location.href = '/';
    }
  }, [isClient, isAuthPage]);

  // Evita Hydration mismatch no render inicial
  if (!isClient) return null;

  if (isAuthPage) {
    return (
      <main className="flex-1 w-full min-h-screen relative flex items-center justify-center">
        {children}
      </main>
    );
  }

  return (
    <>
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen h-screen overflow-y-auto overflow-x-hidden relative">
        <div className="max-w-7xl mx-auto p-8 lg:p-12 h-full pb-32">
          {children}
        </div>
      </main>
    </>
  );
}
