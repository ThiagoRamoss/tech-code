async function seedApi() {
  console.log("🛡️ Iniciando Módulo de Autenticação Real API...");
  
  // 1. Tentar fazer login local se admin existir, caso contrário cria.
  let token = "";
  
  try {
     const loginRes = await fetch('http://localhost:3333/login', {
       method: 'POST', headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email: "admin@techcode.com", password: "123" })
     });
     
     const loginData = await loginRes.json();
     if(loginData.token) {
        token = loginData.token;
        console.log("✅ Admin TechCode Logado. Token Recebido.");
     } else {
        throw new Error("Login Falhou.");
     }
  } catch(e) {
      console.log("Criando usuário Admin Master...");
      await fetch('http://localhost:3333/users', {
         method: 'POST', headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ name: "Admin", email: "admin@techcode.com", password: "123" })
      });
      
      const retryLogin = await fetch('http://localhost:3333/login', {
         method: 'POST', headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email: "admin@techcode.com", password: "123" })
      });
      const data = await retryLogin.json();
      token = data.token;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  console.log("🌐 Conectando à Nave Mãe e enviando Trilhas W3Schools...");

  const rFrontPromise = fetch('http://localhost:3333/roadmaps', {
    method: 'POST', headers,
    body: JSON.stringify({ title: 'Frontend Web Development (W3Schools)', description: 'Aprenda HTML, CSS e JavaScript do zero. O caminho perfeito para construir interfaces visuais incríveis com TailwindCSS e Next.' })
  });

  const rBackPromise = fetch('http://localhost:3333/roadmaps', {
    method: 'POST', headers,
    body: JSON.stringify({ title: 'Backend Node.js Mastery', description: 'Domine a construção de APIs, Express, bancos de dados PostgreSQL e segurança. Construa o cérebro das aplicações reais.' })
  });

  const [resFront, resBack] = await Promise.all([rFrontPromise, rBackPromise]);
  const rFrontData = await resFront.json();
  const rBackData = await resBack.json();

  if(rFrontData.error || !rFrontData.id) {
     console.error("Erro no Frontend Roadmap:", rFrontData);
     return;
  }

  console.log("📂 Roadmaps W3Schools Injetados com Sucesso. Inserindo Artigos...");

  const frontID = rFrontData.id;
  const backID = rBackData.id;

  const htmlData = { title: 'HTML Tutorial', body: 'HTML é a linguagem de marcação padrão para criar páginas Web (W3Schools). Um documento define a estrutura e acessibilidade da página para Leitores de Texto.', roadmapId: frontID };
  const cssData = { title: 'CSS Tutorial', body: 'CSS é usado para formatar o layout de uma página. Você controla cores flexboxes, grids e o modo glassmorphism premium (W3Schools).', roadmapId: frontID };
  const jsData = { title: 'JavaScript Tutorial', body: 'JavaScript é a linguagem de programação mais famosa do mundo. Controla DOM, eventos e APIs assíncronas no Frontend via Vanilla ou Bibliotecas (W3Schools).', roadmapId: frontID };

  await fetch('http://localhost:3333/contents', { method: 'POST', headers, body: JSON.stringify(htmlData) });
  await fetch('http://localhost:3333/contents', { method: 'POST', headers, body: JSON.stringify(cssData) });
  await fetch('http://localhost:3333/contents', { method: 'POST', headers, body: JSON.stringify(jsData) });

  const expressData = { title: 'Express.js Framework', body: 'Express é a infraestrutura de aplicativo da web Node.js mínima e flexível para APIs RESTful elegantes.', roadmapId: backID };
  await fetch('http://localhost:3333/contents', { method: 'POST', headers, body: JSON.stringify(expressData) });

  console.log("📚 Artigos Carregados. Carregando IDCard e Glossário...");

  await fetch('http://localhost:3333/glossary', { method: 'POST', headers, body: JSON.stringify({ term: 'DOM', definition: 'Document Object Model. Interface de programação para renderizar árvores HTML e XML no Browser de forma hierárquica.' }) });
  await fetch('http://localhost:3333/glossary', { method: 'POST', headers, body: JSON.stringify({ term: 'API', definition: 'Application Programming Interface. Protocolo de comunicação entre sistemas distintos em rede.' }) });
  
  // Create IDCard for Admin just so it exists
  const decodedToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  await fetch('http://localhost:3333/idcards', { method: 'POST', headers, body: JSON.stringify({ userId: decodedToken.id, nickname: 'AdminRoot', experience: 550, level: 12 }) });

  console.log("🥂 BINGO! Toda a Base de Dados pré-preenchida de forma genuína pela Interface Master!");
}

seedApi().catch(e => {
  console.log("Ops, o Server Reclamou:", e);
});
