---
title: "Documentação - SourceAimcolorSecret"
tags: [documentacao, lofy, cheat, source, aimcolor]
date: 2026-07-19
---

# SourceAimcolorSecret — Documentação Completa

> **Projeto:** Lofy Client — Aimcolor Secret
> **Propósito:** Cheat para jogos FPS com aimbot por busca de cor (pixel scan)
> **Linguagem:** C++20
> **Build:** CMake + Visual Studio 2022 / MinGW-w64 G++
> **Local:** `D:\Lofy geral\SourceAimcolorSecret`

---

## Estrutura de Diretórios

```
SourceAimcolorSecret/
├── .gitignore
├── CMakeLists.txt              (Build system CMake)
├── build.bat                   (Script build VS2022)
├── build_standalone.bat        (Script build standalone MinGW)
├── build.ps1                   (Script build PowerShell G++)
├── compile_debug.cmd           (Compilação debug manual)
├── funcionalidades.txt         (Lista de funcionalidades)
├── lofy.exe                    (Binário compilado)
│
├── build/                      (Artefatos de build)
│   ├── CMakeCache.txt
│   ├── CMakeFiles/
│   ├── freetype_obj/
│   ├── libfreetype.a
│
├── framework/                  (Código fonte principal)
│   ├── main.cpp
│   │
│   ├── app/
│   │   ├── gui.h / gui.cpp     (Inicialização e renderização da GUI)
│   │
│   ├── core/
│   │   ├── device.h / .cpp     (DirectX 11 / DComp / SwapChain)
│   │   ├── window.h / .cpp     (Window procedure, mensagens, drag-drop)
│   │   ├── backdrop.h / .cpp   (Efeito Mica/Acrylic Windows 10/11)
│   │   ├── blur.h              (Blur gaussiano via pixel shader)
│   │   ├── blur_ps.h           (Bytecode do pixel shader)
│   │
│   ├── data/                   (Dados embutidos: fontes, ícones, logo)
│   │   ├── fontello_data.h/.cpp
│   │   ├── fontello_eye_data.h / eye.obj
│   │   ├── fonts_data.h/.cpp
│   │   ├── logo_data.h / logo.obj / logo.png / logo_icon.obj
│   │
│   ├── helpers/
│   │   ├── anticrack.h/.cpp    (Anti-debug multi-camadas)
│   │   ├── animation.h         (Easing/Animações UI)
│   │   ├── fonts.h/.cpp        (Gerenciamento de fontes ImGui)
│   │   ├── icons.h/.cpp        (Constantes de ícones Fontello)
│   │   ├── logger.h/.cpp       (Webhook Discord)
│   │   ├── stb_impl.cpp        (Implementação stb_image)
│   │   ├── window_drag.h/.cpp  (Arrastar janela pelo client area)
│   │   ├── xorstr.hpp          (XOR strings em tempo de compilação)
│   │
│   ├── lofy/                   (Lógica principal do cheat)
│   │   ├── Common.h            (Estruturas globais, enums, variáveis)
│   │   ├── Config.h/.cpp       (Gerenciamento INI com perfis)
│   │   ├── KeyAuth.h/.cpp      (Autenticação KeyAuth API)
│   │   ├── Aimbot.h/.cpp       (Aimbot por pixel scan)
│   │   ├── Overlay.h/.cpp      (Overlay do FOV circle)
│   │
│   ├── theme/
│   │   ├── colors.h            (Paleta de cores tema escuro)
│   │   ├── layout.h            (Constantes de layout)
│   │
│   └── ui/
│       ├── draw/
│       │   ├── fx.h/.cpp       (Efeitos: glow, shadow, gradient)
│       ├── pages/
│       │   ├── aimbot_page.h/.cpp
│       │   ├── triggerbot_page.h/.cpp
│       │   ├── recoil_page.h/.cpp
│       │   ├── config_page.h/.cpp
│       │   ├── login_page.h/.cpp
│       │   ├── register_page.h/.cpp
│       ├── sidebar/
│       │   ├── sidebar.h/.cpp
│       ├── topbar/
│       │   ├── topbar.h/.cpp
│       └── widgets/
│           ├── widgets.h/.cpp
│
└── thirdparty/
    ├── freetype/               (FreeType pré-compilado)
    │   ├── include/
    │   ├── win64/freetype.lib
    ├── freetype-source/        (FreeType source completo)
    ├── imgui/                  (Dear ImGui v1.x)
    │   ├── imgui.cpp/.h, imgui_draw.cpp, imgui_tables.cpp, imgui_widgets.cpp
    │   ├── imgui_freetype.cpp/.h
    │   ├── imconfig.h, imgui_internal.h, imstb_*.h
    │   ├── backends/
    │   │   ├── imgui_impl_win32.cpp/.h
    │   │   ├── imgui_impl_dx11.cpp/.h
    └── stb/
        └── stb_image.h
```

---

## Tecnologias e Dependências

| Biblioteca | Finalidade | Versão |
|---|---|---|
| **Dear ImGui** | Interface gráfica | v1.x |
| **DirectX 11** | Renderização | SDK Windows |
| **DXGI / DComp** | Composição visual | SDK Windows |
| **DWM API** | Efeitos Mica/Acrylic | dwmapi.lib |
| **FreeType** | Rasterização de fontes | Compilado localmente |
| **STB Image** | Carregamento de imagens | stb_image.h |
| **KeyAuth** | Autenticação online | keyauth.win API |
| **WinHTTP** | HTTP/HTTPS | SDK Windows |
| **Fontello** | Ícones vetoriais | Fonte embutida |
| **Inter Font** | Fonte principal UI | Fonte embutida |

### Dependências de Linkagem
`freetype`, `d3d11`, `dxgi`, `d3dcompiler`, `dcomp`, `dwmapi`, `user32`, `gdi32`, `comctl32`, `kernel32`, `shell32`, `urlmon`, `winhttp`

---

## Funcionalidades

### Aimbot (Aimcolor)
- Busca por cor (pixel scan via `BitBlt`)
- Ajuste de sensibilidade / suavização (momentum)
- Offset por parte do corpo (HEAD: 25px, BODY: 50px, LEG: 85px)
- Deadzone / Clamp de movimento máximo
- Overlay de FOV (círculo transparente)
- Keybind personalizável
- Modo de mira (Hold / Toggle)

### Controle de Recoil
- Padrões: Down, Down+Side, Random, Spray
- Apenas quando LMB pressionado
- Apenas quando mirando (opcional)

### Misc
- **Macro Speed**: download + execução de binário externo
- **Stream Bypass**: `SetWindowDisplayAffinity(WDA_EXCLUDEFROMCAPTURE)`
- **Triggerbot**: disparo automático ao detectar alvo

### Sistema de Perfis
- Salvar / Carregar / Exportar / Importar / Deletar
- Armazenamento em `%APPDATA%\Lofy Client\profiles\*.ini`

### Autenticação KeyAuth
- Login / Registro / Upgrade
- HWID baseado em SID do usuário
- Login persistente em `%APPDATA%\Lofy Client\login.ini`
- Webhook Discord para notificações de login

### Anti-Debug / Anti-Crack
- `IsDebuggerPresent` / `CheckRemoteDebuggerPresent`
- PEB: verificação `BeingDebugged`
- `NtQueryInformationProcess`: `ProcessDebugPort`
- Hardware Breakpoints (Dr0-Dr3)
- Timing via `__rdtsc`
- IAT Hooking detection
- Blacklist de processos (x64dbg, IDA, Cheat Engine, etc.)
- Verificação periódica a cada ~30s

---

## Fluxo de Execução

1. **Inicialização** → `AntiCrack::Check()` verifica debuggers e blacklist
2. **Autenticação** → Tela de Login/Register via KeyAuth
3. **Main Loop** → Abas: Aimcolor / Misc / Config
4. **Thread Separada** → Loop de aimbot + recoil + anti-crack periódico
5. **Aimbot ativo** → Escaneia pixels da tela → move o mouse via `SendInput`
6. **Recoil ativo** → Move mouse para baixo em intervalos com LMB
7. **Ao sair** → Salva config, termina thread, limpa recursos

---

## Scripts de Build

| Script | Compilador | Uso |
|---|---|---|
| `build.bat` | Visual Studio 2022 | `build.bat` |
| `build_standalone.bat` | MinGW-w64 G++ | `build_standalone.bat` |
| `build.ps1` | G++ (PowerShell) | `powershell -File build.ps1` |
| `compile_debug.cmd` | G++ (debug manual) | `compile_debug.cmd` |

---

## Observações

- Strings sensíveis ofuscadas com XOR em tempo de compilação (`xorstr.hpp`)
- Interface em português
- Tema escuro com acentos roxos (`rgb(130, 90, 230)`)
- Janela principal: 740x430
- Hotkey INSERT para toggle, ESC/END para fechar
- Suporte a drag-drop de arquivos `.ini` para importar config
