import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Iniciando Seed Inicial: W3Schools & TechCode Data");

  // Limpando antigos
  await prisma.content.deleteMany();
  await prisma.roadmap.deleteMany();
  await prisma.glossary.deleteMany();

  // 1. Criar Roadmaps
  const frontendRoadmap = await prisma.roadmap.create({
    data: {
      title: "Frontend Web Development (W3Schools)",
      description: "Aprenda HTML, CSS e JavaScript do zero com base nos ensinamentos do W3Schools. O caminho perfeito para construir interfaces visuais incríveis.",
    }
  });

  const backendRoadmap = await prisma.roadmap.create({
    data: {
      title: "Backend Node.js Mastery",
      description: "Domine a construção de APIs, Express, bancos de dados PostgreSQL e segurança. Construa o cérebro das aplicações.",
    }
  });

  // 2. Criar Conteúdos para Frontend
  await prisma.content.createMany({
    data: [
      {
        title: "HTML Tutorial (W3Schools)",
        body: "HTML é a linguagem de marcação padrão para criar páginas Web. Um documento HTML define a estrutura de uma página usando elementos como <h1>, <p>, <div> e <a>.",
        roadmapId: frontendRoadmap.id
      },
      {
        title: "CSS Tutorial (W3Schools)",
        body: "CSS é usado para formatar o layout de uma página. Com CSS, você pode controlar as cores, fontes, os tamanhos do texto, o espaçamento, como os elementos são posicionados, imagens de fundo e mais.",
        roadmapId: frontendRoadmap.id
      },
      {
        title: "JavaScript Tutorial (W3Schools)",
        body: "JavaScript é a linguagem de programação mais popular do mundo. Ela permite páginas da web dinâmicas e interativas. É uma das linguagens de script mais famosas, operando primariamente no lado do cliente.",
        roadmapId: frontendRoadmap.id
      }
    ]
  });

  // 3. Criar Conteúdos para Backend
  await prisma.content.createMany({
    data: [
      {
        title: "Node.js Introduction",
        body: "Node.js é um ambiente de execução JavaScript back-end de código aberto e multiplataforma que é executado no motor V8 e executa o código JavaScript fora de um navegador v1.",
        roadmapId: backendRoadmap.id
      },
      {
        title: "Express.js Framework",
        body: "Express é uma infraestrutura de aplicativo da web Node.js mínima e flexível que fornece um conjunto robusto de recursos para aplicativos da web e móveis. Facilita o roteamento e a manipulação de requisições.",
        roadmapId: backendRoadmap.id
      }
    ]
  });

  // 4. Criar Glossário
  await prisma.glossary.createMany({
     data: [
       { term: "DOM", definition: "Document Object Model. É uma interface de programação para os documentos HTML e XML, representando a página para que os programas possam alterar a estrutura do documento, estilo e conteúdo." },
       { term: "API", definition: "Application Programming Interface. É um conjunto de rotinas e padrões de programação para acesso a um aplicativo de software ou plataforma baseada na Web." },
       { term: "CRUD", definition: "Acrônimo para Create, Read, Update e Delete (Criar, Ler, Atualizar e Excluir). São as 4 operações básicas de armazenamento persistente em Banco de Dados." },
       { term: "JWT", definition: "JSON Web Token. É um padrão aberto que define uma maneira compacta e autônoma para transmitir de forma segura informações entre duas partes como um objeto JSON." },
     ]
  });

  console.log("✅ Seed finalizado! O Banco de Dados agora contém dados incríveis.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
