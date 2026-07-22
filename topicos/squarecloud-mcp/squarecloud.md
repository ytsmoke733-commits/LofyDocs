# Squarecloud MCP 1

## Visão Geral

O servidor MCP da Squarecloud foi implementado como um projeto TypeScript independente em `C:\Users\Administrator\squarecloud-mcp\`, registrado como um MCP **local** no OpenCode.

## Estrutura do Projeto

```
squarecloud-mcp/
├── src/
│   ├── index.ts          # Entry point: registro do servidor MCP e 30+ tools
│   ├── squarecloud.ts    # Singleton do cliente SquareCloudAPI
│   └── tools/
│       ├── types.ts      # Tipos compartilhados (SchemaEntry, Tool)
│       ├── account.ts    # getAccountInfo, getServiceStatus
│       ├── apps.ts       # CRUD de apps + status, logs, métricas
│       ├── databases.ts  # CRUD de databases + status, credenciais
│       ├── deploys.ts    # listDeployments, getDeployConfig
│       ├── envs.ts       # listEnvs, setEnvs, deleteEnvs
│       ├── files.ts      # listFiles, readFile, writeFile, moveFile, deleteFile
│       ├── network.ts    # DNS, cache, domínios, analytics, erros
│       ├── snapshots.ts  # listSnapshots, createSnapshot
│       └── workspaces.ts # listWorkspaces, getWorkspace
├── dist/                 # Compilado (JS + sourcemaps + declarações)
├── package.json          # Dependências: @modelcontextprotocol/sdk, @squarecloud/api, zod
└── tsconfig.json         # Target ES2022, module Node16
```

## Arquitetura

### `squarecloud.ts`
Inicializa um `SquareCloudAPI` singleton a partir da env `SQUARE_CLOUD_API_KEY`.

### `src/tools/types.ts`
Define a interface `Tool` com `name`, `description`, `inputSchema` e `execute`.

### `src/index.ts`
O coração do servidor:

- Cria um `McpServer` (SDK do MCP)
- A função `registerTool()` converte o `inputSchema` genérico para schemas `zod` dinamicamente (string, number, boolean, array, object)
- Registra ~33 tools via `server.tool()` com o schema zod + handler
- Conecta via `StdioServerTransport` (stdio)

## Integração com OpenCode

Em `C:\Users\Administrator\opencode.jsonc`:

```jsonc
"squarecloud": {
  "type": "local",
  "command": ["node", "C:\\Users\\Administrator\\squarecloud-mcp\\dist\\index.js"],
  "enabled": true,
  "env": {
    "SQUARE_CLOUD_API_KEY": "{env:SQUARE_CLOUD_API_KEY}"
  }
}
```

- **Tipo**: `local` (executa um processo Node.js local)
- **API Key**: lida da variável de ambiente `SQUARE_CLOUD_API_KEY` do sistema
- **Transporte**: stdio (comunicação via stdin/stdout com o OpenCode)

## Tools Disponíveis (~33)

| Categoria | Tools |
|-----------|-------|
| **Account** | `getAccountInfo`, `getServiceStatus` |
| **Apps** | `listApps`, `getApp`, `getAppStatus`, `getAppAllStatus`, `getAppLogs`, `getAppMetrics`, `startApp`, `stopApp`, `restartApp`, `deleteApp` |
| **Files** | `listFiles`, `readFile`, `writeFile`, `moveFile`, `deleteFile` |
| **Envs** | `listEnvs`, `setEnvs`, `deleteEnvs` |
| **Deploys** | `listDeployments`, `getDeployConfig` |
| **Network** | `getDNS`, `purgeCache`, `setCustomDomain`, `getAnalytics`, `getNetworkErrors` |
| **Snapshots** | `listSnapshots`, `createSnapshot` |
| **Databases** | `listDatabases`, `getDatabase`, `getDatabaseStatus`, `createDatabase`, `deleteDatabase`, `getDatabaseCredentials` |
| **Workspaces** | `listWorkspaces`, `getWorkspace` |

## Build

```bash
cd squarecloud-mcp
npm run build   # tsc
```

## Observações

- O `convert` para `zod` usa uma estrutura `Record<string, { type, description?, optional? }>` e mapeia manualmente cada tipo para o zod nativo
- O tratamento de erros é centralizado no `registerTool()` - qualquer exceção no `execute` é capturada e retornada como `Error: mensagem`
- O `console.error` é usado para logs do servidor (não interfere no transporte stdio)
