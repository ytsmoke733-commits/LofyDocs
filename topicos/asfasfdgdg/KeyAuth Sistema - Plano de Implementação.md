# KeyAuth System — Plano de Implementação

Documentação do plano utilizado para construir o sistema de autenticação via License Key com Supabase.

---

## 1. Requisitos Iniciais

O cliente precisava de um sistema similar ao **KeyAuth** com as seguintes características:

- **Login apenas via License Key** — sem username, senha ou email para o usuário final
- **HWID Binding** — a key captura o HWID da máquina no primeiro uso e trava nele
- **IP Tracking** — registrar IP do primeiro e último uso
- **Dashboard Admin** — para gerar e gerenciar keys (com email + senha)
- **SDK C++** — para integrar em projetos C++
- **Hospedado no Supabase** — PostgreSQL + Edge Functions

---

## 2. Evolução do Plano

### Versão 1: Plano Complexo (descartado)

Inicialmente pensamos em um sistema completo com:
- `user_profiles` com bcrypt para usuários finais
- `username` + `password` + `email`
- 9 endpoints de API
- 10 tabelas no banco
- Chat, 2FA, webhooks, etc.

**Decisão:** O cliente deixou claro que quer **apenas License Key**. Não precisa de user/password.

### Versão 2: Plano Revisado (aprovado)

Sistema simplificado:
- **Apenas License Key** como identidade do usuário
- **3 endpoints**: `init`, `check`, `logout`
- **5 tabelas**: `apps`, `license_keys`, `sessions`, `logs`, `blacklist`
- **HWID binding automático** no primeiro uso
- **Dashboard** para admin gerir keys

---

## 3. Decisões de Arquitetura

| Decisão | Opção Escolhida | Motivo |
|---|---|---|
| **Autenticação usuário final** | Sistema próprio (tabela `license_keys`) | Não usar Supabase Auth para evitar complexidade |
| **Autenticação admin** | Supabase Auth (email + senha) | Já vem pronto, só conectar |
| **HWID storage** | SHA256 hash | Privacidade do usuário |
| **Formato da key** | `ABCDEF-123456-7890GH-5678IJ` (4x6 chars) | Legível, fácil de digitar |
| **Framework dashboard** | React + Vite | Leve, standalone, deploy fácil |
| **API** | Supabase Edge Functions (Deno) | Serverless, integrado com Supabase |
| **Tempo de sessão** | 24h (configurável por app) | Segurança vs usabilidade |
| **Geração de keys** | Função PostgreSQL `bulk_generate_keys` | RPC direto, sem precisar de servidor |

---

## 4. Fluxo de Desenvolvimento

```
1. Pesquisa
   ├── Analisar KeyAuth (features, API, pricing)
   └── Pesquisar Supabase (Edge Functions, RLS, SQL)

2. Desenho da Arquitetura
   ├── Schema do banco (5 tabelas, 2 functions SQL)
   ├── Endpoints da API (init, check, logout)
   └── Telas do dashboard (6 páginas)
   
3. Implementação
   ├── Migration SQL → schema + RPC functions
   ├── Edge Functions → _shared/ + init/ + check/ + logout/
   ├── Dashboard React → 6 páginas + 3 componentes
   └── SDK C++ → KeyAuth.hpp + KeyAuth.cpp + exemplo

4. Deploy
   ├── Criar projeto Supabase (sa-east-1)
   ├── Aplicar migration (supabase_apply_migration)
   └── Deploy functions (supabase_deploy_edge_function)
   
5. Documentação
   ├── Documentação completa no Obsidian
   └── Plano de implementação (este documento)
```

---

## 5. Estrutura do Projeto

```
keyauth-supabase/                          ← Raiz do projeto
│
├── supabase/                               ← Backend
│   ├── migrations/
│   │   └── 001_core_schema.sql            ← Schema + funções SQL
│   ├── seed.sql                            ← Dados de exemplo
│   └── functions/                          ← Edge Functions (Deno)
│       ├── _shared/
│       │   ├── cors.ts                     ← CORS headers
│       │   ├── types.ts                    ← Interfaces TypeScript
│       │   └── utils.ts                   ← Supabase client, hash, log
│       ├── init/index.ts                   ← POST /init
│       ├── check/index.ts                  ← POST /check
│       └── logout/index.ts                 ← POST /logout
│
├── dashboard/                              ← Frontend Admin
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── .env                                ← Credenciais Supabase
│   ├── src/
│   │   ├── main.tsx                       ← Entry point
│   │   ├── App.tsx                        ← Rotas + auth state
│   │   ├── lib/
│   │   │   └── supabaseClient.ts          ← Cliente Supabase
│   │   ├── pages/
│   │   │   ├── Login.tsx                  ← Login admin
│   │   │   ├── Dashboard.tsx              ← Stats cards
│   │   │   ├── Apps.tsx                   ← CRUD apps
│   │   │   ├── AppDetail.tsx              ← Config + Keys
│   │   │   ├── Keys.tsx                   ← Todas as keys
│   │   │   └── Logs.tsx                   ← Auditoria
│   │   ├── components/
│   │   │   ├── Layout.tsx                 ← Sidebar + content
│   │   │   ├── StatsCard.tsx              ← Card de estatística
│   │   │   └── KeyGenerator.tsx           ← Form de gerar keys
│   │   └── styles/
│   │       └── global.css                 ← Tema escuro
│
└── sdk-cpp/                                ← SDK para C++
    ├── KeyAuth.hpp                         ← Header
    ├── KeyAuth.cpp                         ← Implementação
    ├── CMakeLists.txt                      ← Build system
    └── example/
        └── main.cpp                        ← Exemplo de uso
```

---

## 6. Resumo das Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| **Supabase** | - | Plataforma principal (DB + Functions + Auth) |
| **PostgreSQL** | 17.6.1 | Banco de dados |
| **Deno** | (runtime) | Edge Functions |
| **TypeScript** | - | Backend (Edge Functions) |
| **React** | 18 | Dashboard admin |
| **Vite** | 5 | Bundler do dashboard |
| **C++** | C++17 | SDK cliente |
| **libcurl** | - | HTTP requests no C++ |
| **nlohmann/json** | - | JSON parsing no C++ |

---

## 7. Projeto Supabase (Criado)

| Propriedade | Valor |
|---|---|
| Nome | `keyauth-system` |
| Project Ref | `rjrhjdjfnfehpltjafds` |
| Região | `sa-east-1` (São Paulo) |
| URL | `https://rjrhjdjfnfehpltjafds.supabase.co` |
| Organização | `script` |
| Plano | Free ($0/mês) |

---

## 8. Cronograma Real

| Etapa | Duração |
|---|---|
| Pesquisa + Análise | ~30 min |
| Desenho da arquitetura | ~20 min |
| Migration SQL | ~15 min |
| Edge Functions (3) | ~30 min |
| Dashboard (6 páginas + componentes) | ~45 min |
| SDK C++ | ~15 min |
| Deploy (projeto + migrations + functions) | ~15 min |
| Documentação Obsidian | ~10 min |
| **Total** | **~3 horas** |

---

## 9. Fluxo do Usuário Final

```
┌─────────┐     ┌──────────────┐     ┌─────────────────┐
│  Admin   │────▶│   Dashboard  │────▶│  Gerar Keys     │
│  cria    │     │  (React)     │     │  (100 keys)     │
│  app     │     └──────────────┘     └────────┬────────┘
└─────────┘                                    │
                                               ▼
                                        ┌──────────────┐
                                        │   License Key  │
                                        │ ABCDEF-123456 │
                                        └────────┬──────┘
                                                 │
┌─────────┐     ┌──────────────┐     ┌──────────┴───────┐
│ Usuário │────▶│   App C++    │────▶│  POST /init      │
│ final   │     │  (cliente)   │     │  {key, hwid}     │
└─────────┘     └──────────────┘     └────────┬─────────┘
                                              │
                                    ┌─────────┴─────────┐
                                    │                   │
                              Key Fresh?          Key Active?
                                    │                   │
                                    ▼                   ▼
                            ┌──────────────┐   ┌──────────────┐
                            │ Bind HWID+IP │   │ Verificar    │
                            │ Criar sessão │   │ HWID match   │
                            │ Status=active│   │ Criar sessão │
                            └──────────────┘   └──────────────┘
                                    │                   │
                                    └───────┬───────────┘
                                            ▼
                                    ┌──────────────┐
                                    │ Session Token │
                                    │ Válido por 24h│
                                    └──────────────┘
                                            │
                                    ┌───────┴───────┐
                                    │  POST /check  │
                                    │  (periódico)  │
                                    └───────┬───────┘
                                            │
                                    ┌───────┴───────┐
                                    │ POST /logout  │
                                    │ (ao fechar)   │
                                    └───────────────┘
```

---

## 10. Possíveis Próximos Passos (pós-MVP)

- [ ] **Sistema de 2FA** (Google Authenticator)
- [ ] **Chat in-app** (via Supabase Realtime)
- [ ] **VPN/Proxy detection** (API externa)
- [ ] **Webhooks** (Discord + HTTP)
- [ ] **Customer Panel** (usuário ver suas keys)
- [ ] **SDKs** para Python, C#, JavaScript
- [ ] **Rate limiting** mais sofisticado (Redis)
- [ ] **Upload de arquivos** com CDN
- [ ] **Sistema de Tokens** (hash checks)

---

## 11. Notas

- Sistema criado em **20/07/2026**
- Toda a implementação foi feita via **opencode** + **MCP tools**
- O deploy foi feito diretamente pelo Supabase MCP
- O projeto local está em `C:\Users\Administrator\keyauth-supabase\`

### Correções Pós-Implementação

**Problema 1: RLS policy da tabela `apps` bloqueava criação de apps**
- Causa: `FOR ALL USING` não cobre INSERT
- Fix: Adicionar `WITH CHECK (owner_id = auth.uid())`

**Problema 2: Geração de keys falhava com "Erro ao gerar keys"**
- Causa: Função `bulk_generate_keys` rodava com `SECURITY INVOKER`, RLS do usuário bloqueava INSERT em `license_keys`
- Fix: Mudar para `SECURITY DEFINER` + `GRANT EXECUTE TO authenticated`
