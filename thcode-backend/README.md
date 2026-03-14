# 🎓 TechCode API (Backend) - Projeto Acadêmico

Bem-vindo ao repositório oficial do Backend da **TechCode**. Este é um projeto de natureza estritamente **acadêmica**, desenvolvido com o objetivo de explorar, aplicar e documentar metodologias reais de Engenharia de Software, Arquitetura Limpa e microsserviços.

O escopo central do estudo baseia-se na criação de uma plataforma educativa focada em programação, capaz de gerenciar usuários, trilhas de estudo e, como principal desafio técnico, proporcionar a compilação e execução segura de código remoto em ambientes isolados (Sandbox).

## 🛠️ Stack Tecnológica e Ferramentas de Estudo
As tecnologias abaixo foram selecionadas para compor o escopo da pesquisa e desenvolvimento deste projeto:

* **Ambiente de Execução:** Node.js (v20 LTS) & TypeScript (Tipagem Estrita)
* **Framework Web:** Express.js (Arquitetura RESTful e padrão Controller-Service-Route)
* **Persistência de Dados:** PostgreSQL (v15+)
* **Mapeamento Objeto-Relacional (ORM):** Prisma ORM
* **Cache e Alta Performance:** Redis & `ioredis` (Padrão Cache-Aside)
* **Segurança e Identidade:** JWT (JSON Web Tokens) e Bcrypt (Hash Criptográfico)
* **Mensageria e Filas Assíncronas:** BullMQ (Desacoplamento de processos de I/O bloqueantes)
* **Processamento Isolado (Sandbox):** Docker Engine (Imagens Alpine executadas dinamicamente via `child_process`)

---

## 📦 Arquitetura Ouro e Regra de Domínio

Para fins acadêmicos e de delimitação de escopo, a API foi construída sob uma rigorosa regra de domínio, banindo complexidades acessórias e focando nas **Quatro Pilastras** fundamentais do ecossistema de aprendizado projetado:

1. `Conteúdos` (Artigos e material didático oficial)
2. `ID Card` (Gamificação e perfil de desempenho do estudante)
3. `Roadmap` (Guias estruturados conectando múltiplos conteúdos)
4. `Glossário` (Dicionário técnico de termos de programação)

---

## 🔒 Estudo de Segurança e Defesa

A API foi projetada para simular cenários reais de proteção de dados:
- Implementação de algoritmos matemáticos irreversíveis (`bcrypt`) para ofuscação de credenciais.
- Uso de Middlewares interceptadores (`ensureAuthenticated.ts`) baseados em validação de *Bearer Tokens*.
- Separação clara entre **Rotas Públicas** (como cadastro e leitura de currículo) e **Rotas Privadas** (mutações de banco de dados estritamente acessíveis por entidades autenticadas).

---

## ⚙️ Pesquisa Aplicada: Sandbox Isolado em Fila

O ápice técnico deste projeto acadêmico reside na simulação de juízes online (como *HackerRank*). O backend processa scripts submetidos pelo usuário final de forma segura, evitando a exaustão dos recursos do servidor principal através da seguinte esteira de eventos:

1. A API principal recebe a submissão e delega à Fila Assíncrona (`sandbox-queue`), respondendo `HTTP 200` imediatamente ao cliente.
2. Um `Worker` rodando em thread de retaguarda (Background) consome a fila.
3. O código é transposto para um arquivo temporário físico.
4. O `Worker` invoca a *Docker Daemon* nativa da máquina hospedeira para erguer um contêiner `node:20-alpine` sem acesso à rede, montado exclusivamente para interpretar o script-alvo.
5. Políticas estritas de *Timeout* e autodestruição (`--rm`) mitigam cenários de ataques de laço infinito (Infinite Loops) ou alocação excessiva de memória, retornando o output seguro (stdout/stderr) à plataforma.

---

## 🚀 Guia de Execução Local

### Pré-Requisitos:
- Node.js v20+ e NPM devidamente instalados.
- **Docker Desktop** ativo para provisão de contêineres de Banco de Dados, Redis e Execução.

### Passos para Inicialização:

1. **Clone do Repositório:**
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   cd techcode-backend
   npm install
   ```

2. **Provisão de Infraestrutura (Docker):**
   *(Inicia os serviços de PostgreSQL e Redis mapeados nas portas padrão)*
   ```bash
   docker compose up -d
   ```

3. **Configuração de Ambiente e ORM:**
   Crie o arquivo `.env` constando suas credenciais, contendo por exemplo `DATABASE_URL="postgresql://postgres:suasenha@localhost:5432/techcode_db?schema=public"` e `JWT_SECRET="chave_secreta_estudo"`.
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Boot do Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```
> O servidor iniciará na porta `3333`, pronto para receber requisições do sistema cliente (Frontend) ou de clientes de simulação REST (ex: *Postman / Insomnia*).