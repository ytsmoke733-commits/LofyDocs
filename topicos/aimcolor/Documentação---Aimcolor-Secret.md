# Lofy Client - Aimcolor Secret v6.0

## Documentacao Geral do Projeto

---

## 1. Visao Geral

**Lofy Client** e um software para Windows desenvolvido em C++ que oferece ferramentas auxiliares para jogos FPS, incluindo aimbot por busca de cor, controle de recoil, triggerbot, e um sistema completo de autenticacao via licenca. O projeto utiliza uma arquitetura moderna com DirectX 11, DirectComposition, e ImGui para renderizacao de interface com efeitos visuais avancados (vidro acrilico, blur, glow, sombras).

### Identificacao
- **Nome:** Lofy Client | Aimcolor Secret
- **Versao:** 6.0
- **Tipo:** Aplicacao desktop Windows (Win32)
- **Linguagem:** C++20
- **UI Framework:** ImGui + DirectX 11 + DirectComposition
- **Build System:** CMake / MinGW (G++) / MSVC

---

## 2. Arquitetura do Projeto

```
SourceAimcolorSecret/
├── framework/              # Codigo fonte principal
│   ├── app/                # Camada de aplicacao (GUI orchestrator)
│   ├── core/               # Nucleo (DirectX, Window, Backdrop, Blur)
│   ├── data/               # Dados binarios embutidos (fontes, icones, logo)
│   ├── helpers/            # Utilitarios (fontes, icones, animacao, anti-debug)
│   ├── lofy/               # Logica central (aimbot, config, auth, overlay)
│   ├── theme/              # Tema (cores, layout)
│   ├── ui/                 # Interface do usuario
│   │   ├── draw/           # Efeitos de desenho (glow, shadow, gradient)
│   │   ├── pages/          # Paginas da interface (login, aimbot, config, etc.)
│   │   ├── sidebar/        # Painel lateral
│   │   ├── topbar/         # Barra de abas superior
│   │   └── widgets/        # Widgets customizados
│   └── main.cpp            # Ponto de entrada
├── thirdparty/             # Bibliotecas de terceiros
│   ├── imgui/              # Dear ImGui + backends Win32/DX11
│   ├── freetype/           # FreeType pre-compilado (win64)
│   ├── freetype-source/    # FreeType codigo fonte
│   └── stb/                # STB Image
├── build/                  # Artefatos de build CMake
├── junk/                   # Artefatos de build MSVC
├── CMakeLists.txt          # Configuracao CMake
├── build.bat               # Script de build MSVC
├── build.ps1               # Script de build MinGW
├── build_standalone.bat    # Script de build standalone
└── compile_debug.cmd       # Script de compilacao debug
```

---

## 3. Pilha de Tecnologias

| Componente | Tecnologia |
|---|---|
| Linguagem | C++20 |
| Interface Grafica | Dear ImGui + ImDrawList custom |
| Renderizacao | DirectX 11 (D3D11) |
| Composicao | DirectComposition (DComp) |
| Janelas | Win32 API (WS_POPUP, WS_EX_NOREDIRECTIONBITMAP) |
| Efeito Acrilico | DWM API (Mica/Acrylic) + Pixel Shader blur |
| Fontes | FreeType (rasterizacao) + Inter TTF + Fontello icones |
| Rede | WinHTTP (Win32 API) |
| Autenticacao | Supabase Edge Functions + KeyAuth.win |
| Logging | Discord Webhooks |
| Armazenamento | INI files (GetPrivateProfileString) |
| Compressao de Dados | STB Image (PNG loading) |

---

## 4. Pipeline de Renderizacao

```
Janela Win32 (WS_POPUP, borda 0, sem title bar)
    └── WS_EX_NOREDIRECTIONBITMAP (sem bitmap de redirecionamento)
        └── DirectComposition Visual Tree
            └── SwapChain FLIP_SEQUENTIAL (alpha premultiplicado)
                └── D3D11 Device Context
                    └── ImGui Renderizacao
                        ├── Fundo: Blur Shader (amostra desktop ao vivo)
                        ├── Shell: Rect arredondado com escurecimento
                        ├── Painel superior (topbar + abas)
                        ├── Conteudo (paginas com widgets customizados)
                        └── Efeitos: glow, sombras, texto gradiente
```

### Fluxo de Inicializacao

1. `main()` chamado
2. `AntiCrack::Check()` - verificacoes de integridade
3. `LofyAuth::SetConfig()` - configuracao da API
4. `Overlay::Create()` - criacao da overlay FOV
5. Criacao da janela principal Win32
6. `gfx_create_shared()` - criacao do device D3D11
7. `gfx_create_surface()` - criacao da swapchain + DComp
8. `backdrop_apply()` - aplicacao do efeito Mica/Acrylic
9. `ImGui::Init()` + `gui::initialize()` - inicializacao da UI
10. Criacao da thread secundaria do aimbot (`AimbotThread`)
11. Loop de mensagens (renderizacao continua)

---

## 5. Modulos do Sistema

### 5.1. Core (`framework/core/`)

| Arquivo | Responsabilidade |
|---|---|
| `device.cpp/.h` | Gerenciamento do device D3D11, swapchain, DirectComposition |
| `window.cpp/.h` | Procedimento de janela Win32 (WndProc), mensagens, hotkeys |
| `backdrop.cpp/.h` | Efeito Mica (Win11) / Acrylic (Win10) via DWM API |
| `blur.h` | Blur de fundo gaussiano via pixel shader |
| `blur_ps.h` | Shader bytecode pre-compilado do efeito blur |

### 5.2. Aplicacao (`framework/app/`)

| Arquivo | Responsabilidade |
|---|---|
| `gui.cpp/.h` | Orquestrador da interface: inicializacao, estilo, renderizacao do shell |

### 5.3. Logica Central (`framework/lofy/`)

| Arquivo | Responsabilidade |
|---|---|
| `Common.h` | Tipos compartilhados (`AppConfig`, enums) e variaveis globais |
| `Config.cpp/.h` | Persistencia de configuracao em INI + gerenciamento de perfis |
| `Aimbot.cpp/.h` | Motor de aimbot por busca de cor com varredura de pixels |
| `Overlay.cpp/.h` | Overlay transparente do circulo de FOV via GDI |
| `LofyAuth.cpp/.h` | Autenticacao via Supabase (login por chave, sessoes, HWID) |
| `KeyAuth.cpp/.h` | Autenticacao secundaria via KeyAuth.win |

### 5.4. Interface (`framework/ui/`)

| Arquivo | Responsabilidade |
|---|---|
| `topbar/topbar.cpp/.h` | Barra de abas superior (Aimcolor, Misc, Config) |
| `sidebar/sidebar.cpp/.h` | Painel lateral de navegacao (atualmente desabilitado) |
| `pages/aimbot_page.cpp/.h` | Pagina de configuracao do aimbot |
| `pages/triggerbot_page.cpp/.h` | Pagina de configuracoes diversas (recoil, macro, stream bypass) |
| `pages/config_page.cpp/.h` | Pagina de gerenciamento de perfis de configuracao |
| `pages/recoil_page.cpp/.h` | Pagina de controle de recoil |
| `pages/login_page.cpp/.h` | Tela de login com chave de licenca |
| `pages/register_page.cpp/.h` | Tela informativa de registro |
| `widgets/widgets.cpp/.h` | Widgets customizados (checkbox, slider, combo, keybind, paineis) |
| `draw/fx.cpp/.h` | Primitivas de efeitos visuais (glow, sombra, texto gradiente) |

### 5.5. Helpers (`framework/helpers/`)

| Arquivo | Responsabilidade |
|---|---|
| `fonts.cpp/.h` | Gerenciamento de fontes (Inter + icones) via FreeType |
| `icons.cpp/.h` | Definicoes de glifos de icones (Fontello) |
| `animation.h` | Funcoes de easing e interpolacao para animacoes |
| `window_drag.cpp/.h` | Arrastar janela sem borda pelo clique |
| `anticrack.cpp/.h` | Sistema anti-debug e anti-tamper |
| `logger.cpp/.h` | Envio de logs para Discord via Webhook |
| `stb_impl.cpp` | Implementacao do STB Image |
| `xorstr.hpp` | Ofuscacao de strings em tempo de compilacao (XOR) |

### 5.6. Tema (`framework/theme/`)

| Arquivo | Responsabilidade |
|---|---|
| `colors.h` | Paleta de cores (tema escuro roxo) |
| `layout.h` | Dimensoes e espacamentos da interface |

### 5.7. Dados (`framework/data/`)

| Arquivo | Responsabilidade |
|---|---|
| `fonts_data.cpp/.h` | Dados binarios das fontes Inter + icones |
| `fontello_data.cpp/.h` | Dados binarios da fonte Fontello (~700KB) |
| `fontello_eye_data.h` | Subconjunto da fonte de olho para abas |
| `logo_data.h` | Logo PNG embutido via linker |

---

## 6. Funcionalidades Detalhadas

### 6.1. Autenticacao (LofyAuth)

O sistema de autenticacao utiliza Supabase Edge Functions para validacao de chaves de licenca.

**Fluxo de Login:**
1. Usuario digita a chave de licenca na tela de login
2. Cliente verifica integridade do PE (checksum)
3. Envia POST `/init` com: chave, HWID (SID do usuario), hash SHA-256 do executavel, versao
4. Servidor valida e retorna: token de sessao, nivel, data de expiracao
5. Cliente persiste a chave localmente em `login.ini`
6. A cada ~60 segundos: POST `/check` para validar sessao
7. Ao fechar: POST `/logout`

**Seguranca:**
- URL da API e app ID ofuscados com XOR em tempo de compilacao
- Validacao de checksum PE para detectar adulteracao
- HWID locking (vincula chave ao hardware)
- Expuracao de sessao com countdown

### 6.2. Aimbot por Cor (Color Aimbot)

O aimbot funciona varrendo pixels da tela em busca de uma cor especifica (ex: vermelho de inimigos).

**Algoritmo:**
1. Calcula retangulo de FOV baseado em `fovX`/`fovY` (centralizado na tela)
2. Captura regiao com `BitBlt` para um DIB section
3. Varre pixel por pixel com `FastPixelSearch()` comparando com `emColor` + tolerancia
4. Se encontra cor: calcula delta do centro + offset por parte do corpo
5. Aplica zona morta (dead zone), suavizacao com momentum (70/30 blend)
6. Aplica clamp no ajuste maximo e threshold de movimento minimo
7. Executa `SendInput` com `MOUSEEVENTF_MOVE`

**Parametros Configuraveis:**
- Velocidade (0.1 - 2.5)
- Suavizacao (1 - 10)
- Ajuste Maximo (1 - 30 pixels)
- FOV X/Y (20 - 320)
- Zona Morta (1 - 30)
- Parte do Corpo: Cabeca, Corpo, Perna
- Tecla de Ativacao (Hold/Toggle)
- Cor Alvo + Tolerancia

### 6.3. Controle de Recoil

Opera na thread principal do aimbot a cada 5ms:
- Quando tecla de macro de recoil esta ativa: envia movimento vertical do mouse via `SendInput`
- Intensidade e delay configuraveis
- Padroes: Down, Down+Side, Random, Spray (interface com alguns stubs)

### 6.4. Overlay de FOV

Janela transparente separada (WS_POPUP + layered) que desenha um circulo GDI:
- Cor e alpha configuraveis
- `SetWindowDisplayAffinity(WDA_EXCLUDEFROMCAPTURE)` para ocultar de captura de tela
- Sempre no topo, clicavel (pass-through)

### 6.5. Stream Bypass

Utiliza `SetWindowDisplayAffinity(0x11)` nas janelas principal e overlay para oculta-las de programas de captura de tela (OBS, Discord, etc.).

### 6.6. Macro Speed

Download de um executavel externo (`MacroSpeed.exe`) do GitHub Releases e execucao. Ao desabilitar, o processo e terminado e o arquivo deletado.

### 6.7. Gerenciamento de Perfis

Permite salvar, carregar, exportar, importar e deletar configuracoes completas:
- Perfis salvos como arquivos `.ini` em `%APPDATA%\Lofy Client\profiles\`
- Importacao via arrastar e soltar arquivo na janela
- Exportacao com dialogo de salvar

### 6.8. Animacoes e Efeitos Visuais

- **Blur de Fundo:** Amostra o desktop atras da janela e aplica blur gaussiano via pixel shader
- **Glow:** Expansao de rect/circle com multiplas camadas e alpha decrescente
- **Sombra:** Drop shadow suave abaixo dos elementos
- **Texto Gradiente:** Caractere por caractere com cor interpolada
- **Animacao de Widgets:** Easing frame-rate independent (lerp, smoothstep) em hover, active, toggle
- **Transicao de Telas:** Crossfade entre login e tela principal
- **Rotacao de Icones:** Manipulacao de vertices pos-render para rotacionar icones

---

## 7. Sistema Anti-Debug / Anti-Crack

Implementado em `anticrack.cpp/.h`:

| Tecnica | Descricao |
|---|---|
| `IsDebuggerPresent` | Chamada direta a API |
| PEB BeingDebugged | Leitura direta do PEB via `__readgsqword(0x60)` |
| `NtQueryInformationProcess` | Consulta ProcessDebugPort |
| Hardware Breakpoints | Leitura dos registradores Dr0-Dr3 via `GetThreadContext` |
| RDTSC Timing | Deteccao de single-stepping por diferenca de ciclos |
| IAT Hooks | Verificacao de prologo de `IsDebuggerPresent` |
| Blacklist de Processos | Varredura de processos (x64dbg, OllyDbg, Cheat Engine, IDA, etc.) |
| PE Checksum | Validacao de integridade do executavel |

A funcao `Check()` executa todas as verificacoes e chama `ExitProcess(0)` se detectar algo.
`FastCheck()` executa verificacoes leves periodicas (a cada ~30s na thread do aimbot).

---

## 8. Sistema de Logger (Discord Webhook)

Eventos de login sao registrados em webhooks do Discord:
- **Login bem-sucedido:** Embed com chave mascarada, HWID, nivel, expiracao
- **Tentativa falha:** Embed com HWID, IP externo (api.ipify.org), mensagem de erro
- URLs e paths ofuscados com XOR

---

## 9. Sistema de Configuracao

### 9.1. AppConfig (Estrutura Principal)

```cpp
struct AppConfig {
    // Aimbot
    double sliderVelo, smoothFactor, maxAdjustment;
    double minMoveThreshold, smoothDecel;
    double aimOffsetY, deadZone;
    double fovX, fovY;
    int aimPart;              // 0=HEAD, 1=BODY, 2=LEG
    int emColor[3];           // RGB alvo
    int colorTolerance;

    // Overlay
    bool overlayVisible;
    int overlayAlpha;
    int overlayColor[3];

    // Recoil
    bool recoilEnabled;
    int recoilStrength, recoilDelay;

    // Triggerbot
    bool triggerbotEnabled;

    // Keybinds
    int aimbotKey, aimbotKeyMode;          // toggle/hold
    int macroRecoilKey, macroRecoilKeyMode;
    int macroRecoilStrength, macroRecoilDelay;
};
```

### 9.2. Persistencia

- Arquivo principal: `%APPDATA%\Lofy Client\config.ini`
- Perfis: `%APPDATA%\Lofy Client\profiles\[nome].ini`
- Login persistente: `%APPDATA%\Lofy Client\login.ini`
- Formato: INI (Windows GetPrivateProfileString/WritePrivateProfileString)

---

## 10. Dependencias e Build

### Dependencias de Terceiros

| Biblioteca | Uso |
|---|---|
| Dear ImGui v1.91+ | Interface grafica |
| FreeType | Rasterizacao de fontes |
| STB Image | Carregamento de PNG |
| Fontello | Icones vetoriais |
| Inter Font | Fonte principal |

### Bibliotecas do Sistema (Win32)

`d3d11`, `dxgi`, `d3dcompiler`, `dcomp`, `dwmapi`, `user32`, `gdi32`, `comctl32`, `kernel32`, `shell32`, `winhttp`, `crypt32`, `imagehlp`

### Metodos de Build

**MSVC (Visual Studio 2022):**
```bash
build.bat
```

**MinGW (G++):**
```powershell
.\build.ps1
```

**Standalone:**
```bash
build_standalone.bat
```

**Debug:**
```cmd
compile_debug.cmd
```

---

## 11. Fluxo de Execucao Completo

```
[Inicio]
    │
    ├── AntiCrack::Check()  ← Verificacoes anti-debug
    │
    ├── LofyAuth::SetConfig()  ← Configura URL da API
    │
    ├── Overlay::Create()  ← Cria janela overlay do FOV
    │
    ├── Criacao Janela Principal
    │   ├── RegisterClass + CreateWindowEx (WS_EX_NOREDIRECTIONBITMAP)
    │   └── DragAcceptFiles (para importar config)
    │
    ├── gfx_create_shared()  ← D3D11CreateDevice
    │
    ├── gfx_create_surface()  ← SwapChain + DComp
    │
    ├── backdrop_apply()  ← Mica/Acrylic
    │
    ├── ImGui Init + gui::initialize()  ← Fontes, estilo, logo
    │
    ├── Criacao AimbotThread  ← Thread secundaria
    │
    └── Loop de Mensagens
        │
        ├── WM_HOTKEY (Insert) → toggle g_visible
        ├── WM_KEYDOWN (Escape/End) → PostQuitMessage
        ├── WM_SIZE → redimensionamento pendente
        ├── WM_DROPFILES → captura caminho do arquivo
        │
        └── Renderizacao (cada frame)
            ├── Verifica sessao (LofyAuth::Check)
            ├── Tela de Login/Registro ou Tela Principal
            │
            └── Tela Principal:
                ├── draw_background_blur (efeito vidro)
                ├── ShellTint (overlay escurecido)
                ├── topbar::draw_header (abas)
                ├── Pagina selecionada (aimbot / triggerbot / config)
                └── window_drag::handle
```

### Thread Secundaria (AimbotThread)

```
Loop: sleep(5ms)
    │
    ├── toggle/hold da tecla do aimbot
    │
    ├── Se aimbot ativo → Aimbot::Run(g_aimState, g_cfg)
    │
    ├── toggle/hold da tecla de macro de recoil
    │
    ├── Se macro ativo → SendInput (movimento vertical)
    │
    └── AntiCrack::FastCheck() a cada ~30s
```

---

## 12. Estrutura de Dados da Interface

### Telas (AppScreen)

```cpp
enum class AppScreen {
    LOGIN,      // Tela de login com chave
    REGISTER,   // Tela informativa de registro
    MAIN        // Tela principal com abas
};
```

### Abas Principais (topbar::combat_tab)

```cpp
enum class combat_tab {
    aimbot,     // Configuracao do aimbot
    triggerbot, // Configuracoes diversas (recoil, macro, bypass)
    config      // Gerenciamento de perfis
};
```

### Partes do Corpo (AimPart)

```cpp
enum AimPart {
    HEAD,   // offset Y = -25
    BODY,   // offset Y = 0
    LEG     // offset Y = +25
};
```

---

## 13. Seguranca e Ofuscacao

- **Strings ofuscadas:** Macro `XOR()` para ofuscar strings em tempo de compilacao (URLs, nomes de API, webhook paths)
- **Anti-Debug:** Multiplas camadas de deteccao (PEB, NtQuery, hardware breakpoints, timing)
- **Anti-Tamper:** Validacao de checksum PE antes do login
- **Anti-Captura:** Display affinity para ocultar de streams
- **HWID Lock:** Vinculacao ao SID do usuario Windows

---

## 14. Licenciamento

Este projeto utiliza um sistema de licenciamento proprietario baseado em:
- Chaves de ativacao gerenciadas via Supabase (Edge Functions)
- Vinculacao ao hardware do usuario (HWID por SID)
- Sessoes com expiracao validadas periodicamente
- Sistema de nveis de acesso
- Dashboard administrativo para gerenciamento de chaves

---

## 15. Notas de Desenvolvimento

- O sidebar esta definido mas desabilitado (`sidebar_w = 0.f`)
- A pagina de recoil possui alguns elementos stub (padroes nao implementados)
- O sistema KeyAuth.win esta implementado mas nao e utilizado no fluxo principal
- A pagina de registro e apenas informativa
- O debug logging usa `OutputDebugStringA` (visivel com DebugView)

---

*Documentacao gerada em Julho de 2026.*
*Lofy Client | Aimcolor Secret v6.0*
